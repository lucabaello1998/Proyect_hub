using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProyectHub.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddAuditLogFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Data",
                table: "AuditLogs",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PerformedByEmail",
                table: "AuditLogs",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "RestoredAt",
                table: "AuditLogs",
                type: "datetime2",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Data",
                table: "AuditLogs");

            migrationBuilder.DropColumn(
                name: "PerformedByEmail",
                table: "AuditLogs");

            migrationBuilder.DropColumn(
                name: "RestoredAt",
                table: "AuditLogs");
        }
    }
}
