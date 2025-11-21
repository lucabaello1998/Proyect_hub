using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProyectHub.Data.Migrations
{
    /// <inheritdoc />
    public partial class RemoveRevokeRestoreFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Details",
                table: "AuditLogs");

            migrationBuilder.DropColumn(
                name: "RestoredAt",
                table: "AuditLogs");

            migrationBuilder.DropColumn(
                name: "Revoked",
                table: "AuditLogs");

            migrationBuilder.DropColumn(
                name: "RevokedAt",
                table: "AuditLogs");

            migrationBuilder.DropColumn(
                name: "RevokedBy",
                table: "AuditLogs");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Details",
                table: "AuditLogs",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "RestoredAt",
                table: "AuditLogs",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "Revoked",
                table: "AuditLogs",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "RevokedAt",
                table: "AuditLogs",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "RevokedBy",
                table: "AuditLogs",
                type: "int",
                nullable: true);
        }
    }
}
