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
        builder.WithOrigins("https://localhost:44468", "https://talentfrontend-gnc3h4brgyfvdbfb.australiaeast-01.azurewebsites.net")
               .AllowAnyHeader()
               .AllowAnyMethod();
    });
});

string connectionString;
if (builder.Environment.IsDevelopment())
{
    connectionString = builder.Configuration.GetConnectionString("LocalConnectionString");
}
else
{
    connectionString = builder.Configuration.GetConnectionString("AzureConnectionString");
}

builder.Services.AddDbContext<TalentDbContext>(options =>
    options.UseSqlServer(connectionString));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UseHttpsRedirection();

app.UseRouting();

app.UseCors("AllowLocalhost");

app.UseAuthorization();

app.MapControllers();

app.Run();


