package org.teacher_calendar.service;

import org.teacher_calendar.dto.LabelDto;
import org.teacher_calendar.entity.Label;
import org.teacher_calendar.entity.User;
import org.teacher_calendar.repository.LabelRepository;
import org.teacher_calendar.repository.UserRepository;
import org.teacher_calendar.util.DtoConverter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class LabelService {

    private final LabelRepository labelRepository;
    private final UserRepository userRepository;

    @Autowired
    public LabelService(LabelRepository labelRepository, UserRepository userRepository) {
        this.labelRepository = labelRepository;
        this.userRepository = userRepository;
    }

    public List<LabelDto> getAllLabels(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return labelRepository.findByUser(user)
                .stream()
                .map(DtoConverter::toDto)
                .collect(Collectors.toList());
    }

    public LabelDto createLabel(LabelDto labelDto, Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Проверяем, нет ли уже метки с таким именем у пользователя
        if (labelRepository.existsByNameAndUserId(labelDto.getName(), userId)) {
            throw new RuntimeException("Label with this name already exists");
        }

        Label label = new Label();
        label.setName(labelDto.getName());
        label.setColor(labelDto.getColor());
        label.setEmoji(labelDto.getEmoji());
        label.setUser(user);

        Label savedLabel = labelRepository.save(label);
        return DtoConverter.toDto(savedLabel);
    }

    public LabelDto updateLabel(Integer id, LabelDto labelDto) {
        Label label = labelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Label not found"));

        // Проверяем уникальность имени, если оно изменилось
        if (!label.getName().equals(labelDto.getName())) {
            if (labelRepository.existsByNameAndUserId(labelDto.getName(), label.getUser().getId())) {
                throw new RuntimeException("Label with this name already exists");
            }
        }

        label.setName(labelDto.getName());
        label.setColor(labelDto.getColor());
        label.setEmoji(labelDto.getEmoji());

        Label updatedLabel = labelRepository.save(label);
        return DtoConverter.toDto(updatedLabel);
    }

    public boolean deleteLabel(Integer id) {
        if (!labelRepository.existsById(id)) {
            return false;
        }

        labelRepository.deleteById(id);
        return true;
    }

    public LabelDto getLabelById(Integer id) {
        return labelRepository.findById(id)
                .map(DtoConverter::toDto)
                .orElse(null);
    }

    // Новый метод для получения меток по списку ID
    public List<LabelDto> getLabelsByIds(List<Integer> ids) {
        return labelRepository.findAllById(ids)
                .stream()
                .map(DtoConverter::toDto)
                .collect(Collectors.toList());
    }
}