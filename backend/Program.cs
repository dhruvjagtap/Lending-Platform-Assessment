using backend.Data;
using backend.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection")
    ));

builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactPolicy", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173", "https://lendingplatform.vercel.app")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddScoped<LoanApplicationService>();
builder.Services.AddScoped<LoanDecisionService>();
builder.Services.AddScoped<StatisticsService>();

var app = builder.Build();

app.UseHttpsRedirection();

app.UseCors("ReactPolicy");

app.MapControllers();

app.Run();