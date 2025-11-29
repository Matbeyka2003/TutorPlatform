package org.teacher_calendar.controller;

import org.teacher_calendar.dto.ClientDto;
import org.teacher_calendar.dto.LessonDto;
import org.teacher_calendar.service.DataManager;
import javafx.collections.ObservableList;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.geometry.Insets;
import javafx.scene.control.*;
import javafx.scene.control.cell.PropertyValueFactory;
import javafx.scene.layout.GridPane;
import javafx.scene.layout.HBox;
import javafx.scene.layout.VBox;

import java.net.URL;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Optional;
import java.util.ResourceBundle;

public class CalendarController implements Initializable {
    @FXML private VBox calendarContainer;
    @FXML private Label weekLabel;
    @FXML private GridPane calendarGrid;
    @FXML private Button prevWeekButton;
    @FXML private Button nextWeekButton;

    private LocalDate currentWeekStart;
    private final DataManager dataManager = DataManager.getInstance();

    @Override
    public void initialize(URL location, ResourceBundle resources) {
        currentWeekStart = LocalDate.now().with(java.time.DayOfWeek.MONDAY);
        updateCalendar();
    }

    @FXML
    private void handlePrevWeek() {
        currentWeekStart = currentWeekStart.minusWeeks(1);
        updateCalendar();
    }

    @FXML
    private void handleNextWeek() {
        currentWeekStart = currentWeekStart.plusWeeks(1);
        updateCalendar();
    }

    private void updateCalendar() {
        // Обновляем заголовок с датами недели
        LocalDate weekEnd = currentWeekStart.plusDays(6);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy");
        weekLabel.setText("Неделя: " + currentWeekStart.format(formatter) + " - " + weekEnd.format(formatter));

        // Очищаем календарь (оставляем только заголовки)
        calendarGrid.getChildren().clear();

        // Создаем заголовки дней недели
        createDayHeaders();

        // Загружаем уроки из сервера и отображаем их
        loadAndDisplayLessons();
    }

    private void createDayHeaders() {
        String[] daysOfWeek = {"Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"};

        for (int i = 0; i < daysOfWeek.length; i++) {
            Label dayLabel = new Label(daysOfWeek[i] + "\n" + currentWeekStart.plusDays(i).getDayOfMonth());
            dayLabel.setStyle("-fx-font-weight: bold; -fx-alignment: center;");
            dayLabel.setMaxSize(Double.MAX_VALUE, Double.MAX_VALUE);
            calendarGrid.add(dayLabel, i, 0);
        }
    }

    private void loadAndDisplayLessons() {
        try {
            ObservableList<LessonDto> lessons = dataManager.getLessonsForWeek(currentWeekStart);

            // Группируем уроки по дням недели
            for (int day = 0; day < 7; day++) {
                LocalDate currentDate = currentWeekStart.plusDays(day);
                VBox dayColumn = new VBox(5);
                dayColumn.setPadding(new Insets(5));
                dayColumn.setStyle("-fx-border-color: lightgray; -fx-border-width: 1;");

                for (LessonDto lesson : lessons) {
                    if (lesson.getDateTime().toLocalDate().equals(currentDate)) {
                        Button lessonBtn = createLessonButton(lesson);
                        dayColumn.getChildren().add(lessonBtn);
                    }
                }

                // Добавляем кнопку для создания нового урока
                Button addLessonBtn = new Button("+");
                addLessonBtn.setMaxWidth(Double.MAX_VALUE);
                addLessonBtn.setOnAction(e -> handleAddLesson(currentDate));
                dayColumn.getChildren().add(addLessonBtn);

                calendarGrid.add(dayColumn, day, 1);
            }
        } catch (Exception e) {
            showErrorDialog("Ошибка загрузки уроков", e.getMessage());
        }
    }

    private Button createLessonButton(LessonDto lesson) {
        Button btn = new Button();
        btn.setMaxWidth(Double.MAX_VALUE);

        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");
        String time = lesson.getDateTime().toLocalTime().format(timeFormatter);
        String clientName = lesson.getClient() != null ? lesson.getClient().getName() : "Не указан";

        btn.setText(time + "\n" + clientName);
        btn.setOnAction(e -> handleEditLesson(lesson));

        // Стилизация в зависимости от статуса урока
        if (lesson.getIsPaid()) {
            btn.setStyle("-fx-background-color: #a5d6a7;");
        } else {
            btn.setStyle("-fx-background-color: #ffab91;");
        }

        return btn;
    }

    private void handleAddLesson(LocalDate date) {
        LessonDto newLesson = showLessonDialog("Добавить урок", new LessonDto(), date);
        if (newLesson != null) {
            try {
                dataManager.addLesson(newLesson);
                updateCalendar();
            } catch (Exception e) {
                showErrorDialog("Ошибка добавления урока", e.getMessage());
            }
        }
    }

    private void handleEditLesson(LessonDto lesson) {
        LessonDto updatedLesson = showLessonDialog("Редактировать урок", lesson, lesson.getDateTime().toLocalDate());
        if (updatedLesson != null) {
            try {
                dataManager.updateLesson(updatedLesson);
                updateCalendar();
            } catch (Exception e) {
                showErrorDialog("Ошибка обновления урока", e.getMessage());
            }
        }
    }

    private LessonDto showLessonDialog(String title, LessonDto lesson, LocalDate date) {
        Dialog<LessonDto> dialog = new Dialog<>();
        dialog.setTitle(title);

        ButtonType saveButtonType = new ButtonType("Сохранить", ButtonBar.ButtonData.OK_DONE);
        dialog.getDialogPane().getButtonTypes().addAll(saveButtonType, ButtonType.CANCEL);

        GridPane grid = new GridPane();
        grid.setHgap(10);
        grid.setVgap(10);
        grid.setPadding(new Insets(20, 150, 10, 10));

        // Получаем список клиентов для выпадающего списка
        ObservableList<ClientDto> clients = dataManager.getClients();
        ComboBox<ClientDto> clientCombo = new ComboBox<>(clients);
        clientCombo.setValue(lesson.getClient());

        Spinner<Integer> hourSpinner = new Spinner<>(0, 23,
                lesson.getDateTime() != null ? lesson.getDateTime().getHour() : 12);
        Spinner<Integer> minuteSpinner = new Spinner<>(0, 59,
                lesson.getDateTime() != null ? lesson.getDateTime().getMinute() : 0);

        CheckBox paidCheckbox = new CheckBox("Оплачено");
        paidCheckbox.setSelected(lesson.getIsPaid() != null ? lesson.getIsPaid() : false);

        TextArea descriptionArea = new TextArea(lesson.getDescription());
        descriptionArea.setPrefRowCount(3);

        grid.add(new Label("Клиент:"), 0, 0);
        grid.add(clientCombo, 1, 0);
        grid.add(new Label("Время:"), 0, 1);
        grid.add(new HBox(5, hourSpinner, new Label(":"), minuteSpinner), 1, 1);
        grid.add(paidCheckbox, 1, 2);
        grid.add(new Label("Описание:"), 0, 3);
        grid.add(descriptionArea, 1, 3);

        dialog.getDialogPane().setContent(grid);

        dialog.setResultConverter(dialogButton -> {
            if (dialogButton == saveButtonType) {
                lesson.setClient(clientCombo.getValue());
                lesson.setDateTime(date.atTime(hourSpinner.getValue(), minuteSpinner.getValue()));
                lesson.setIsPaid(paidCheckbox.isSelected());
                lesson.setDescription(descriptionArea.getText());
                return lesson;
            }
            return null;
        });

        Optional<LessonDto> result = dialog.showAndWait();
        return result.orElse(null);
    }

    private void showErrorDialog(String title, String message) {
        Alert alert = new Alert(Alert.AlertType.ERROR);
        alert.setTitle(title);
        alert.setHeaderText(null);
        alert.setContentText(message);
        alert.showAndWait();
    }
}