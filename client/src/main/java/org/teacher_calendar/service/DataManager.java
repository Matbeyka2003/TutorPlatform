package org.teacher_calendar.service;

import org.teacher_calendar.dto.AuthRequest;
import org.teacher_calendar.dto.ClientDto;
import org.teacher_calendar.dto.LessonDto;
import org.teacher_calendar.dto.UserDto;
import org.teacher_calendar.http.ApiClient;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;

import java.time.LocalDate;

public class DataManager {
    private static DataManager instance;
    private final ApiClient apiClient;
    private UserDto currentUser;
    private String authToken; // Для будущего использования с JWT

    private DataManager() {
        // Базовый URL нашего сервера
        this.apiClient = new ApiClient("http://localhost:8080");
    }

    public static DataManager getInstance() {
        if (instance == null) {
            instance = new DataManager();
        }
        return instance;
    }

    // ===== AUTHENTICATION METHODS =====

    public boolean authenticate(String username, String password) {
        try {
            AuthRequest authRequest = new AuthRequest(username, password);
            UserDto user = apiClient.authenticate(authRequest);

            if (user != null) {
                this.currentUser = user;
                return true;
            }
            return false;
        } catch (Exception e) {
            throw new RuntimeException("Ошибка аутентификации: " + e.getMessage(), e);
        }
    }

    public boolean register(String username, String password) {
        try {
            AuthRequest authRequest = new AuthRequest(username, password);
            UserDto user = apiClient.register(authRequest);

            return user != null;
        } catch (Exception e) {
            throw new RuntimeException("Ошибка регистрации: " + e.getMessage(), e);
        }
    }

    public void logout() {
        this.currentUser = null;
        this.authToken = null;
    }

    public boolean isAuthenticated() {
        return currentUser != null;
    }

    public UserDto getCurrentUser() {
        return currentUser;
    }

    // ===== CLIENT METHODS =====

    public ObservableList<ClientDto> getClients() {
        if (!isAuthenticated()) {
            throw new RuntimeException("Пользователь не аутентифицирован");
        }

        try {
            return FXCollections.observableArrayList(apiClient.getAllClients());
        } catch (Exception e) {
            showError("Ошибка загрузки клиентов", e.getMessage());
            return FXCollections.observableArrayList();
        }
    }

    public void addClient(ClientDto client) throws Exception {
        if (!isAuthenticated()) {
            throw new Exception("Пользователь не аутентифицирован");
        }

        try {
            apiClient.createClient(client);
        } catch (Exception e) {
            throw new Exception("Ошибка добавления клиента: " + e.getMessage());
        }
    }

    public void updateClient(ClientDto client) throws Exception {
        if (!isAuthenticated()) {
            throw new Exception("Пользователь не аутентифицирован");
        }

        try {
            apiClient.updateClient(client);
        } catch (Exception e) {
            throw new Exception("Ошибка обновления клиента: " + e.getMessage());
        }
    }

    public void deleteClient(int id) throws Exception {
        if (!isAuthenticated()) {
            throw new Exception("Пользователь не аутентифицирован");
        }

        try {
            boolean success = apiClient.deleteClient(id);
            if (!success) {
                throw new Exception("Клиент не найден");
            }
        } catch (Exception e) {
            throw new Exception("Ошибка удаления клиента: " + e.getMessage());
        }
    }

    public ClientDto getClientById(int clientId) throws Exception {
        if (!isAuthenticated()) {
            throw new Exception("Пользователь не аутентифицирован");
        }

        try {
            ClientDto client = apiClient.getClientById(clientId);
            if (client == null) {
                throw new Exception("Клиент не найден");
            }
            return client;
        } catch (Exception e) {
            throw new Exception("Ошибка получения клиента: " + e.getMessage());
        }
    }

    // ===== LESSON METHODS =====

    public ObservableList<LessonDto> getLessonsForWeek(LocalDate weekStart) throws Exception {
        if (!isAuthenticated()) {
            throw new Exception("Пользователь не аутентифицирован");
        }

        try {
            return FXCollections.observableArrayList(apiClient.getLessonsForWeek(weekStart));
        } catch (Exception e) {
            throw new Exception("Ошибка загрузки уроков: " + e.getMessage());
        }
    }

    public void addLesson(LessonDto lesson) throws Exception {
        if (!isAuthenticated()) {
            throw new Exception("Пользователь не аутентифицирован");
        }

        try {
            apiClient.createLesson(lesson);
        } catch (Exception e) {
            throw new Exception("Ошибка добавления урока: " + e.getMessage());
        }
    }

    public void updateLesson(LessonDto lesson) throws Exception {
        if (!isAuthenticated()) {
            throw new Exception("Пользователь не аутентифицирован");
        }

        try {
            apiClient.updateLesson(lesson);
        } catch (Exception e) {
            throw new Exception("Ошибка обновления урока: " + e.getMessage());
        }
    }

    private void showError(String title, String message) {
        // Временная реализация - позже интегрируем с JavaFX Alert
        System.err.println(title + ": " + message);
    }
}