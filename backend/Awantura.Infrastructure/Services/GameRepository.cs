﻿using Awantura.Application.Hubs;
using Awantura.Application.Interfaces;
using Awantura.Domain.Entities;
using Awantura.Domain.Enums;
using Awantura.Domain.Models;
using Awantura.Domain.Models.Auth;
using Awantura.Domain.Models.SignalREvents;
using Awantura.Infrastructure.Data;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace Awantura.Infrastructure.Services
{
    public class GameRepository : IGameRepository
    {
        private readonly AwanturaAuthDbContext _context;
        private readonly IHubContext<GameHub> _hubContext;

        public GameRepository(AwanturaAuthDbContext context, IHubContext<GameHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }

        public async Task<Guid> CreateNewGame(Guid playerId)
        {
            var gameId = Guid.NewGuid();

            var game = new Game
            {
                Id = gameId,
                GameState = GameState.NotStarted,
                Round = 0,
                PlayerScores = new List<PlayerGameScore>
                {
                    new PlayerGameScore
                    {
                        GameId = gameId,
                        PlayerId = playerId,
                        CurrentPoints = 0
                    }
                },
                GameParticipants = new GameParticipants
                {
                    Id = Guid.NewGuid(),
                    BluePlayerId = playerId,
                    isBluePlayerReady = false,
                    GreenPlayerId = null,
                    isGreenPlayerReady = false,
                    YellowPlayerId = null,
                    isYellowPlayerReady = false,
                    GameId = gameId
                }
            };

            _context.Games.Add(game);
            await _context.SaveChangesAsync();
            return gameId;
        }

        public async Task<CustomMessageResult> AddPlayerToGame(Guid gameId, PlayerDto player)
        {
            var game = await _context.Games
                .Include(g => g.GameParticipants)
                .FirstOrDefaultAsync(g => g.Id == gameId);

            if (game == null)
            {
                return new CustomMessageResult
                {
                    Success = false,
                    Message = "Game not found."
                };
            }

            var participants = game.GameParticipants;

            if (participants.BluePlayerId == player.Id || participants.GreenPlayerId == player.Id || participants.YellowPlayerId == player.Id)
            {
                return new CustomMessageResult
                {
                    Success = true,
                    Message = "Player is already in the game."
                };
            }

            if (participants.GreenPlayerId == Guid.Empty)
                participants.GreenPlayerId = player.Id;
            else if (participants.YellowPlayerId == Guid.Empty)
                participants.YellowPlayerId = player.Id;
            else
            {
                return new CustomMessageResult
                {
                    Success = false,
                    Message = "No available slots in the game."
                };
            }

            var playerGameScore = new PlayerGameScore
            {
                GameId = gameId,
                PlayerId = player.Id,
                CurrentPoints = 0
            };

            _context.PlayerGameScores.Add(playerGameScore);

            await _context.SaveChangesAsync();

            PlayerJoinedDto playerJoinedEvent = new PlayerJoinedDto
            {
                Id = player.Id,
                Username = player.UserName,
                PlayerColor = participants.GreenPlayerId == player.Id ? "green" : "blue"
            };

            await _hubContext.Clients.Group(gameId.ToString().ToLower()).SendAsync("PlayerJoined", playerJoinedEvent);

            return new CustomMessageResult
            {
                Success = true,
                Message = "Player added to the game successfully."
            };
        }

        public async Task<CustomMessageResult> StartGame(Guid gameId)
        {
            var game = await _context.Games
               .FirstOrDefaultAsync(g => g.Id == gameId);

            if (game == null)
            {
                return new CustomMessageResult
                {
                    Success = false,
                    Message = "Game guid is incorrect, it doesn't exsist."
                };
            }


            if (game.GameState == GameState.NotStarted)
            {
                game.GameState = GameState.CATEGORY_DRAW;
                game.Round = 1;
            }
            else
            {
                return new CustomMessageResult
                {
                    Success = false,
                    Message = "Game have already started!"
                };
            }

            await _context.SaveChangesAsync();

            await _hubContext.Clients.Group(gameId.ToString().ToLower()).SendAsync("GameStarted", gameId);

            return new CustomMessageResult
            {
                Success = true,
                Message = $"Game {game.Id} started!"
            };
        }

        public async Task<Game> GetGame(Guid gameId, string playerId)
        {
            var game = await _context.Games.Include(g => g.GameParticipants)
               .FirstOrDefaultAsync(g => g.Id == gameId);

            if (game == null)
            {
                return null;
            }

            var participants = game.GameParticipants;
            var playerGuid = new Guid(playerId);

            if (participants.BluePlayerId == playerGuid || participants.GreenPlayerId == playerGuid || participants.YellowPlayerId == playerGuid)
            {
                return game;
            }

            // Player is not a participant of game
            return null;
        }

        public async Task<bool> SetPlayerReady(Guid gameId, Guid playerId)
        {
            var game = await _context.Games
                .Include(g => g.GameParticipants)
                .FirstOrDefaultAsync(g => g.Id == gameId);

            if (game == null)
                return false;

            if (game.GameParticipants.BluePlayerId == playerId)
                game.GameParticipants.isBluePlayerReady = true;
            else if (game.GameParticipants.GreenPlayerId == playerId)
                game.GameParticipants.isGreenPlayerReady = true;
            else if (game.GameParticipants.YellowPlayerId == playerId)
                game.GameParticipants.isYellowPlayerReady = true;
            else
                return false;

            await _context.SaveChangesAsync();

            return true;
        }
    }
}
