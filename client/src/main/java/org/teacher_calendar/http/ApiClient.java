package org.teacher_calendar.http;

import org.teacher_calendar.dto.AuthRequest;
import org.teacher_calendar.dto.ClientDto;
import org.teacher_calendar.dto.LessonDto;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.teacher_calendar.dto.UserDto;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

public class ApiClient {
    private final String baseUrl;
    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;

    public ApiClient(String baseUrl) {
        this.baseUrl = baseUrl;
        this.httpClient = HttpClient.newHttpClient();
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
    }

    // ===== CLIENT METHODS =====

    public List<ClientDto> getAllClients() {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(baseUrl + "/api/clients"))
                    .header("Content-Type", "application/json")
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                ClientDto[] clients = objectMapper.readValue(response.body(), ClientDto[].class);
                return Arrays.asList(clients);
            } else {
                throw new RuntimeException("Failed to get clients: " + response.statusCode());
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to get clients: " + e.getMessage(), e);
        }
    }

    public ClientDto getClientById(Integer id) {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(baseUrl + "/api/clients/" + id))
                    .header("Content-Type", "application/json")
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                return objectMapper.readValue(response.body(), ClientDto.class);
            } else if (response.statusCode() == 404) {
                return null;
            } else {
                throw new RuntimeException("Failed to get client: " + response.statusCode());
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to get client: " + e.getMessage(), e);
        }
    }

    public ClientDto createClient(ClientDto client) {
        try {
            String requestBody = objectMapper.writeValueAsString(client);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(baseUrl + "/api/clients"))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                return objectMapper.readValue(response.body(), ClientDto.class);
            } else {
                throw new RuntimeException("Failed to create client: " + response.statusCode());
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to create client: " + e.getMessage(), e);
        }
    }

    public ClientDto updateClient(ClientDto client) {
        try {
            String requestBody = objectMapper.writeValueAsString(client);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(baseUrl + "/api/clients/" + client.getId()))
                    .header("Content-Type", "application/json")
                    .PUT(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                return objectMapper.readValue(response.body(), ClientDto.class);
            } else {
                throw new RuntimeException("Failed to update client: " + response.statusCode());
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to update client: " + e.getMessage(), e);
        }
    }

    public boolean deleteClient(Integer id) {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(baseUrl + "/api/clients/" + id))
                    .header("Content-Type", "application/json")
                    .DELETE()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            return response.statusCode() == 200;
        } catch (Exception e) {
            return false;
        }
    }

    // ===== LESSON METHODS =====

    public List<LessonDto> getAllLessons() {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(baseUrl + "/api/lessons"))
                    .header("Content-Type", "application/json")
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                LessonDto[] lessons = objectMapper.readValue(response.body(), LessonDto[].class);
                return Arrays.asList(lessons);
            } else {
                throw new RuntimeException("Failed to get lessons: " + response.statusCode());
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to get lessons: " + e.getMessage(), e);
        }
    }

    public List<LessonDto> getLessonsForWeek(LocalDate weekStart) {
        try {
            String url = baseUrl + "/api/lessons/week?weekStart=" + weekStart.toString();

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("Content-Type", "application/json")
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                LessonDto[] lessons = objectMapper.readValue(response.body(), LessonDto[].class);
                return Arrays.asList(lessons);
            } else {
                throw new RuntimeException("Failed to get lessons for week: " + response.statusCode());
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to get lessons for week: " + e.getMessage(), e);
        }
    }

    public LessonDto createLesson(LessonDto lesson) {
        try {
            String requestBody = objectMapper.writeValueAsString(lesson);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(baseUrl + "/api/lessons"))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                return objectMapper.readValue(response.body(), LessonDto.class);
            } else {
                throw new RuntimeException("Failed to create lesson: " + response.statusCode());
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to create lesson: " + e.getMessage(), e);
        }
    }

    public LessonDto updateLesson(LessonDto lesson) {
        try {
            String requestBody = objectMapper.writeValueAsString(lesson);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(baseUrl + "/api/lessons/" + lesson.getId()))
                    .header("Content-Type", "application/json")
                    .PUT(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                return objectMapper.readValue(response.body(), LessonDto.class);
            } else {
                throw new RuntimeException("Failed to update lesson: " + response.statusCode());
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to update lesson: " + e.getMessage(), e);
        }
    }

    public boolean deleteLesson(Integer id) {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(baseUrl + "/api/lessons/" + id))
                    .header("Content-Type", "application/json")
                    .DELETE()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            return response.statusCode() == 200;
        } catch (Exception e) {
            return false;
        }
    }
    // Добавляем методы аутентификации в класс ApiClient:

    public UserDto authenticate(AuthRequest authRequest) {
        try {
            String requestBody = objectMapper.writeValueAsString(authRequest);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(baseUrl + "/api/auth/login"))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                return objectMapper.readValue(response.body(), UserDto.class);
            } else {
                throw new RuntimeException("Authentication failed: " + response.statusCode());
            }
        } catch (Exception e) {
            throw new RuntimeException("Authentication error: " + e.getMessage(), e);
        }
    }

    public UserDto register(AuthRequest authRequest) {
        try {
            String requestBody = objectMapper.writeValueAsString(authRequest);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(baseUrl + "/api/auth/register"))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                return objectMapper.readValue(response.body(), UserDto.class);
            } else {
                throw new RuntimeException("Registration failed: " + response.statusCode());
            }
        } catch (Exception e) {
            throw new RuntimeException("Registration error: " + e.getMessage(), e);
        }
    }
}