package org.teacher_calendar.service;

import org.teacher_calendar.dto.UserDto;
import org.teacher_calendar.entity.User;
import org.teacher_calendar.repository.UserRepository;
import org.teacher_calendar.util.DtoConverter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Аутентификация пользователя
    public UserDto authenticate(String username, String password) {
        logger.debug("Authenticating user: {}", username);

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> {
                    logger.warn("User not found: {}", username);
                    return new RuntimeException("Пользователь не найден");
                });

        logger.debug("Stored password hash: {}", user.getPassword());
        logger.debug("Provided password: {}", password);

        if (!passwordEncoder.matches(password, user.getPassword())) {
            logger.warn("Password mismatch for user: {}", username);
            throw new RuntimeException("Неверный пароль");
        }

        logger.info("Authentication successful for user: {}", username);
        return DtoConverter.toDto(user);
    }

    // Создать нового пользователя
    public UserDto createUser(UserDto userDto, String rawPassword) {
        logger.debug("Creating user: {}", userDto.getUsername());

        if (userRepository.existsByUsername(userDto.getUsername())) {
            logger.warn("User already exists: {}", userDto.getUsername());
            throw new RuntimeException("Пользователь с таким именем уже существует");
        }

        User user = DtoConverter.toEntity(userDto);
        String encodedPassword = passwordEncoder.encode(rawPassword);
        logger.debug("Encoded password: {}", encodedPassword);

        user.setPassword(encodedPassword);

        User savedUser = userRepository.save(user);
        logger.info("User created successfully: {}", userDto.getUsername());

        return DtoConverter.toDto(savedUser);
    }

    // Остальные методы остаются без изменений
    public List<UserDto> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(DtoConverter::toDto)
                .collect(Collectors.toList());
    }

    public UserDto getUserById(Integer id) {
        return userRepository.findById(id)
                .map(DtoConverter::toDto)
                .orElse(null);
    }

    public UserDto updateUser(Integer id, UserDto userDto) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        existingUser.setTimezone(userDto.getTimezone());
        existingUser.setTelegramChatId(userDto.getTelegramChatId());

        User updatedUser = userRepository.save(existingUser);
        return DtoConverter.toDto(updatedUser);
    }

    public boolean deleteUser(Integer id) {
        if (!userRepository.existsById(id)) {
            return false;
        }

        userRepository.deleteById(id);
        return true;
    }
}