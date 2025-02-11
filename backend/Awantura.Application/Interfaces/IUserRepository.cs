﻿using Awantura.Domain.Models.Auth;
using Microsoft.AspNetCore.Identity;

namespace Awantura.Application.Interfaces
{
    public interface IUserRepository
    {
        Task<List<IdentityUser>> GetAllUsers();
        Task<IdentityUser> GetUserById(string id);
        Task<IdentityUser> UpdateUser(string id, PlayerDto UserBody);
        Task<IdentityUser> DeleteUser(string id);
    }
}
