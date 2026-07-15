using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NongSan.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddCancelFieldsToShopOrder : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CancelledBy",
                table: "ShopOrders",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CancelledReason",
                table: "ShopOrders",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CancelledBy",
                table: "ShopOrders");

            migrationBuilder.DropColumn(
                name: "CancelledReason",
                table: "ShopOrders");
        }
    }
}
