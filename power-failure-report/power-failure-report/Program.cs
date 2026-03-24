using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Reflection;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// ==========================================
// 1. ตั้งค่า Configuration (จำลองการดึงจาก Vault / appsettings.json)
// ==========================================
// ในการทำงานจริง คุณอาจต้องดึงค่า s3AccessKey, csServiceApiKey, gisPassword ฯลฯ จาก Vault Provider
var configuration = builder.Configuration;

// ==========================================
// 2. Add Services to the container
// ==========================================
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
    });

// ตั้งค่า HttpClient สำหรับยิง API ไปยัง CS-Service และ GIS
builder.Services.AddHttpClient();

// ตั้งค่า Swagger สำหรับการเทส API (เพิ่มช่องใส่ Bearer Token)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "PEA Smart Plus 3 - Outage API", Version = "v1" });

    // ตั้งค่าให้ Swagger รับ Bearer Token ได้
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "ใส่ JWT Token ในรูปแบบ: Bearer {token}",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });

    // เพิ่มบรรทัดนี้เพื่ออ่าน XML Comments
    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    if (File.Exists(xmlPath))
    {
        c.IncludeXmlComments(xmlPath);
    }
});

// ==========================================
// 3. ตั้งค่า JWT Authentication
// ==========================================
// ตามสเปก API ทุกตัวต้องมีการแนบ Authorization: Bearer accessToken
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false, // ปิดการตรวจสอบชั่วคราวเพื่อเทส
        ValidateAudience = false, // ปิดการตรวจสอบชั่วคราวเพื่อเทส
        ValidateLifetime = false, // ปิดการตรวจสอบชั่วคราวเพื่อเทส
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"] ?? "ThisIsAVeryLongAndSecretKeyForJwtSigning123!"))
    };
});

// ==========================================
// 4. การจัดการ Middleware
// ==========================================
var app = builder.Build();

// แสดง Swagger ในทุก Environment สำหรับการ Demo/Dev
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "PEA Smart Plus 3 - Outage API V1");
});

app.UseHttpsRedirection();

// สำคัญ: ต้องใส่ UseAuthentication ก่อน UseAuthorization
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
