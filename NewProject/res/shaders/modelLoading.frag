#version 330 core
out vec4 FragColor;

struct Light {
    vec3 position;

    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
};

in vec3 FragPos;
in vec3 Normal;
in vec2 TexCoords;
  
uniform vec3 viewPos;
uniform Light light;

uniform sampler2D texture_diffuse;
uniform sampler2D texture_specular;
uniform float shininess;

void main()
{
    // ambient
    vec3 ambient = light.ambient * texture(texture_diffuse, TexCoords).rgb;
      
    // diffuse
    vec3 norm = normalize(Normal);
    vec3 lightDir = normalize(light.position - FragPos);
    float dotNormLight = dot(norm, lightDir);
    float diff = max(dotNormLight, 0.0);
    vec3 diffuse = light.diffuse * diff * texture(texture_diffuse, TexCoords).rgb;
    
    // specular
    vec3 viewDir = normalize(viewPos - FragPos);
    vec3 reflectDir = reflect(-lightDir, norm);
    float spec;
    if (dotNormLight > 0) {
        spec = pow(max(dot(viewDir, reflectDir), 0.0), shininess);
    }
    else spec = 0.0f;
    vec3 specular = light.specular * (spec * texture(texture_specular, TexCoords).rgb);
    vec3 result = ambient + diffuse + specular;

    float opacity = texture(texture_diffuse, TexCoords).a;
    FragColor = vec4(result, opacity);
    
}

