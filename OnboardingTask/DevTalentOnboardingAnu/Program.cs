using DevTalentOnboardingAnu.Models;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();



builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost", builder =>
    {
        builder.WithOrigins("https://localhost:44468")
               .AllowAnyHeader()
               .AllowAnyMethod();
    });
});

//builder.Services.AddControllers()
//        .AddJsonOptions(options =>
//        {
//            options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.Preserve;
//        });

builder.Services.AddDbContext<TalentDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("ConnectionString")));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UseHttpsRedirection();

app.UseRouting();

app.UseCors("AllowLocalhost");
//app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

app.Run();



//*********************/



//// Swagger configuration
//builder.Services.AddEndpointsApiExplorer();
//builder.Services.AddSwaggerGen();

//// ... other configuration code ...
//builder.Services.AddCors(options =>
//{
//    options.AddPolicy("AllowLocalhost", builder =>
//    {
//        builder.WithOrigins("https://localhost:44468")
//               .AllowAnyHeader()
//               .AllowAnyMethod();
//    });
//});
//builder.Services.AddControllers()
//    .AddJsonOptions(options =>
//    {
//        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.Preserve;
//        options.JsonSerializerOptions.MaxDepth = 64; // Optionally increase the max depth if needed
//    });

//var app = builder.Build();

//// Configure the HTTP request pipeline.
//if (app.Environment.IsDevelopment())
//{
//    app.UseSwagger();
//    app.UseSwaggerUI();
//}

//app.UseHttpsRedirection();

//app.UseAuthorization();

//app.UseCors("AllowLocalhost44468");

//app.MapControllers();

//app.Run();



