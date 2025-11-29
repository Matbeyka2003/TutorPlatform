package org.teacher_calendar.controller;

import org.teacher_calendar.dto.AuthRequest;
import org.teacher_calendar.dto.UserDto;
import org.teacher_calendar.service.DataManager;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.stage.Stage;

public class AuthController {
    @FXML private TextField usernameField;
    @FXML private PasswordField passwordField;
    @FXML private Button loginButton;
    @FXML private Button registerButton;
    @FXML private Label statusLabel;
    @FXML private ProgressIndicator progressIndicator;

    private final DataManager dataManager = DataManager.getInstance();

    @FXML
    private void initialize() {
        // Скрываем прогресс-индикатор по умолчанию
        progressIndicator.setVisible(false);

        // Обработчики для кнопок при нажатии Enter
        usernameField.setOnAction(e -> login());
        passwordField.setOnAction(e -> login());
    }

    @FXML
    private void handleLogin() {
        login();
    }

    @FXML
    private void handleRegister() {
        register();
    }

    private void login() {
        String username = usernameField.getText().trim();
        String password = passwordField.getText();

        if (username.isEmpty() || password.isEmpty()) {
            showError("Заполните все поля");
            return;
        }

        showProgress(true);

        // Запускаем в отдельном потоке чтобы не блокировать UI
        new Thread(() -> {
            try {
                boolean success = dataManager.authenticate(username, password);

                // Возвращаемся в UI поток
                javafx.application.Platform.runLater(() -> {
                    showProgress(false);
                    if (success) {
                        openMainApplication();
                    } else {
                        showError("Неверное имя пользователя или пароль");
                    }
                });
            } catch (Exception e) {
                javafx.application.Platform.runLater(() -> {
                    showProgress(false);
                    showError("Ошибка подключения к серверу: " + e.getMessage());
                });
            }
        }).start();
    }

    private void register() {
        String username = usernameField.getText().trim();
        String password = passwordField.getText();

        if (username.isEmpty() || password.isEmpty()) {
            showError("Заполните все поля");
            return;
        }

        if (password.length() < 6) {
            showError("Пароль должен содержать не менее 6 символов");
            return;
        }

        showProgress(true);

        new Thread(() -> {
            try {
                boolean success = dataManager.register(username, password);

                javafx.application.Platform.runLater(() -> {
                    showProgress(false);
                    if (success) {
                        showSuccess("Регистрация успешна! Теперь вы можете войти.");
                        passwordField.clear();
                    } else {
                        showError("Пользователь с таким именем уже существует");
                    }
                });
            } catch (Exception e) {
                javafx.application.Platform.runLater(() -> {
                    showProgress(false);
                    showError("Ошибка регистрации: " + e.getMessage());
                });
            }
        }).start();
    }

    private void openMainApplication() {
        try {
            // Закрываем окно аутентификации
            Stage authStage = (Stage) loginButton.getScene().getWindow();
            authStage.close();

            // Открываем главное приложение
            FXMLLoader loader = new FXMLLoader(getClass().getResource("/org/teacher_calendar/view/MainWindow.fxml"));
            Parent root = loader.load();

            Stage mainStage = new Stage();
            mainStage.setTitle("Tutor Scheduler - " + dataManager.getCurrentUser().getUsername());
            mainStage.setScene(new Scene(root, 1000, 700));
            mainStage.setMinWidth(800);
            mainStage.setMinHeight(600);
            mainStage.show();

        } catch (Exception e) {
            showError("Ошибка запуска приложения: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private void showProgress(boolean show) {
        progressIndicator.setVisible(show);
        loginButton.setDisable(show);
        registerButton.setDisable(show);
        usernameField.setDisable(show);
        passwordField.setDisable(show);
    }

    private void showError(String message) {
        statusLabel.setText(message);
        statusLabel.setStyle("-fx-text-fill: #d32f2f; -fx-font-weight: bold;");
    }

    private void showSuccess(String message) {
        statusLabel.setText(message);
        statusLabel.setStyle("-fx-text-fill: #388e3c; -fx-font-weight: bold;");
    }
}