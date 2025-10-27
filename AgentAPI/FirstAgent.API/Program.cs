using Azure.AI.Projects;
using Azure.Core;
using Azure.Identity;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddSingleton<TokenCredential, DefaultAzureCredential>();

// Register AgentsClient with injected credential and connection string
builder.Services.AddSingleton(provider =>
{
    var credential = provider.GetRequiredService<TokenCredential>();

    // Your Azure AI Foundry connection string
    string connectionString = "eastus2.api.azureml.ms;180fb610-ef6b-47b4-a1af-cfadafb0983e;SandeepPatil-RG;aiagentproject";

    return new AgentsClient(connectionString, credential);
});
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost5173", policy =>
    { 
        policy.AllowAnyOrigin()
             .AllowAnyHeader()
             .AllowAnyMethod();
    });
});


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Use CORS before authorization and routing
app.UseCors("AllowLocalhost5173");

app.UseAuthorization();

app.MapControllers();

app.Run();
