package org.teacher_calendar.controller;

import org.teacher_calendar.dto.ClientDto;
import org.teacher_calendar.service.DataManager;
import javafx.collections.ObservableList;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.geometry.Insets;
import javafx.scene.control.*;
import javafx.scene.control.cell.PropertyValueFactory;
import javafx.scene.layout.GridPane;

import java.net.URL;
import java.util.Optional;
import java.util.ResourceBundle;

public class ClientController implements Initializable {
    @FXML private TableView<ClientDto> clientTable;
    @FXML private TableColumn<ClientDto, Integer> idColumn;
    @FXML private TableColumn<ClientDto, String> nameColumn;
    @FXML private TableColumn<ClientDto, String> phoneColumn;
    @FXML private TableColumn<ClientDto, String> timezoneColumn;

    private final DataManager dataManager = DataManager.getInstance();

    @Override
    public void initialize(URL location, ResourceBundle resources) {
        setupTableColumns();
        refreshClients();
    }

    private void setupTableColumns() {
        idColumn.setCellValueFactory(new PropertyValueFactory<>("id"));
        nameColumn.setCellValueFactory(new PropertyValueFactory<>("name"));
        phoneColumn.setCellValueFactory(new PropertyValueFactory<>("phone"));
        timezoneColumn.setCellValueFactory(new PropertyValueFactory<>("timezone"));
    }

    private void refreshClients() {
        ObservableList<ClientDto> clients = dataManager.getClients();
        clientTable.setItems(clients);
    }

    @FXML
    private void handleAddClient() {
        ClientDto newClient = showClientDialog("Добавить клиента", new ClientDto());
        if (newClient != null) {
            try {
                dataManager.addClient(newClient);
                refreshClients();
            } catch (Exception e) {
                showErrorDialog("Ошибка добавления клиента", e.getMessage());
            }
        }
    }

    @FXML
    private void handleEditClient() {
        ClientDto selectedClient = clientTable.getSelectionModel().getSelectedItem();
        if (selectedClient == null) {
            showAlert("Выберите клиента", "Пожалуйста, выберите клиента для редактирования");
            return;
        }

        ClientDto updatedClient = showClientDialog("Редактировать клиента", selectedClient);
        if (updatedClient != null) {
            try {
                dataManager.updateClient(updatedClient);
                refreshClients();
            } catch (Exception e) {
                showErrorDialog("Ошибка обновления клиента", e.getMessage());
            }
        }
    }

    @FXML
    private void handleDeleteClient() {
        ClientDto selectedClient = clientTable.getSelectionModel().getSelectedItem();
        if (selectedClient == null) {
            showAlert("Выберите клиента", "Пожалуйста, выберите клиента для удаления");
            return;
        }

        if (confirmAction("Удаление клиента",
                "Вы уверены, что хотите удалить клиента " + selectedClient.getName() + "?")) {
            try {
                dataManager.deleteClient(selectedClient.getId());
                refreshClients();
            } catch (Exception e) {
                showErrorDialog("Ошибка удаления клиента", e.getMessage());
            }
        }
    }

    private ClientDto showClientDialog(String title, ClientDto client) {
        Dialog<ClientDto> dialog = new Dialog<>();
        dialog.setTitle(title);

        ButtonType saveButtonType = new ButtonType("Сохранить", ButtonBar.ButtonData.OK_DONE);
        dialog.getDialogPane().getButtonTypes().addAll(saveButtonType, ButtonType.CANCEL);

        GridPane grid = new GridPane();
        grid.setHgap(10);
        grid.setVgap(10);
        grid.setPadding(new Insets(20, 150, 10, 10));

        TextField nameField = new TextField(client.getName());
        TextField phoneField = new TextField(client.getPhone());
        TextField timezoneField = new TextField(client.getTimezone());
        TextField cityField = new TextField(client.getCity());
        TextArea descriptionArea = new TextArea(client.getDescription());
        descriptionArea.setPrefRowCount(3);

        grid.add(new Label("Имя*:"), 0, 0);
        grid.add(nameField, 1, 0);
        grid.add(new Label("Телефон*:"), 0, 1);
        grid.add(phoneField, 1, 1);
        grid.add(new Label("Часовой пояс*:"), 0, 2);
        grid.add(timezoneField, 1, 2);
        grid.add(new Label("Город:"), 0, 3);
        grid.add(cityField, 1, 3);
        grid.add(new Label("Описание:"), 0, 4);
        grid.add(descriptionArea, 1, 4);

        dialog.getDialogPane().setContent(grid);

        dialog.setResultConverter(dialogButton -> {
            if (dialogButton == saveButtonType) {
                client.setName(nameField.getText());
                client.setPhone(phoneField.getText());
                client.setTimezone(timezoneField.getText());
                client.setCity(cityField.getText());
                client.setDescription(descriptionArea.getText());
                return client;
            }
            return null;
        });

        Optional<ClientDto> result = dialog.showAndWait();
        return result.orElse(null);
    }

    private void showAlert(String title, String message) {
        Alert alert = new Alert(Alert.AlertType.WARNING);
        alert.setTitle(title);
        alert.setHeaderText(null);
        alert.setContentText(message);
        alert.showAndWait();
    }

    private void showErrorDialog(String title, String message) {
        Alert alert = new Alert(Alert.AlertType.ERROR);
        alert.setTitle(title);
        alert.setHeaderText(null);
        alert.setContentText(message);
        alert.showAndWait();
    }

    private boolean confirmAction(String title, String message) {
        Alert alert = new Alert(Alert.AlertType.CONFIRMATION);
        alert.setTitle(title);
        alert.setHeaderText(null);
        alert.setContentText(message);

        Optional<ButtonType> result = alert.showAndWait();
        return result.isPresent() && result.get() == ButtonType.OK;
    }
}