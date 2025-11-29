package org.teacher_calendar;

import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.stage.Stage;

public class Main extends Application {
    @Override
    public void start(Stage primaryStage) throws Exception {
        // Загружаем окно аутентификации вместо главного окна
        FXMLLoader loader = new FXMLLoader(getClass().getResource("/org/teacher_calendar/view/AuthWindow.fxml"));
        Parent root = loader.load();

        Scene scene = new Scene(root, 400, 500);

        primaryStage.setTitle("Tutor Scheduler - Вход");
        primaryStage.setScene(scene);
        primaryStage.setResizable(false);
        primaryStage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}