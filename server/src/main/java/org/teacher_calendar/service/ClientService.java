package org.teacher_calendar.service;

import org.teacher_calendar.dto.ClientDto;
import org.teacher_calendar.entity.Client;
import org.teacher_calendar.entity.User;
import org.teacher_calendar.repository.ClientRepository;
import org.teacher_calendar.repository.UserRepository;
import org.teacher_calendar.util.DtoConverter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ClientService {

    private final ClientRepository clientRepository;
    private final UserRepository userRepository;

    @Autowired
    public ClientService(ClientRepository clientRepository, UserRepository userRepository) {
        this.clientRepository = clientRepository;
        this.userRepository = userRepository;
    }

    public List<ClientDto> getAllClients(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return clientRepository.findByUser(user)
                .stream()
                .map(DtoConverter::toDto)
                .collect(Collectors.toList());
    }

    public ClientDto getClientById(Integer id) {
        return clientRepository.findById(id)
                .map(DtoConverter::toDto)
                .orElse(null);
    }

    public ClientDto createClient(ClientDto clientDto, Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Client client = DtoConverter.toEntity(clientDto);
        client.setUser(user);
        Client savedClient = clientRepository.save(client);
        return DtoConverter.toDto(savedClient);
    }

    public ClientDto updateClient(Integer id, ClientDto clientDto) {
        Client existingClient = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client not found with id: " + id));

        // Обновляем только необходимые поля, сохраняя связь с пользователем
        existingClient.setName(clientDto.getName());
        existingClient.setPhone(clientDto.getPhone());
        existingClient.setTimezone(clientDto.getTimezone());
        existingClient.setCity(clientDto.getCity());
        existingClient.setDescription(clientDto.getDescription());
        existingClient.setLessonPrice(clientDto.getLessonPrice());

        Client updatedClient = clientRepository.save(existingClient);
        return DtoConverter.toDto(updatedClient);
    }

    public boolean deleteClient(Integer id) {
        if (!clientRepository.existsById(id)) {
            return false;
        }

        clientRepository.deleteById(id);
        return true;
    }

    public List<ClientDto> searchClientsByName(String name) {
        return clientRepository.findByNameContainingIgnoreCase(name)
                .stream()
                .map(DtoConverter::toDto)
                .collect(Collectors.toList());
    }
}