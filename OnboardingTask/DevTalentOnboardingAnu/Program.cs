using DevTalentOnboardingAnu.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();

// Configure CORS policies
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost", builder =>
    {
        builder.WithOrigins("https://localhost:44468")
               .AllowAnyHeader()
               .AllowAnyMethod();
    });

    options.AddPolicy("AllowProductionOrigins", builder =>
    {
        builder.WithOrigins("https://talentfrontend-gnc3h4brgyfvdbfb.australiaeast-01.azurewebsites.net")
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
    app.UseCors("AllowLocalhost"); // For development
}
else
{
    app.UseExceptionHandler("/Home/Error"); // Generic error handling in production
    app.UseHsts(); // HTTP Strict Transport Security
    app.UseCors("AllowProductionOrigins"); // For production
}

app.UseHttpsRedirection();
app.UseRouting();
app.UseAuthorization();
app.MapControllers();
app.Run();
