package strategy

import (
	"fmt"
	"strings"
)

type TemperatureStrategy struct{}

func (s *TemperatureStrategy) Convert(value float64, from, to string) (float64, error) {
	from = strings.ToLower(strings.TrimSpace(from))
	to = strings.ToLower(strings.TrimSpace(to))

	if from == "" || to == "" {
		return 0, fmt.Errorf("from/to units are required")
	}

	valueInC, err := toCelsius(value, from)
	if err != nil {
		return 0, err
	}

	return fromCelsius(valueInC, to)
}

func toCelsius(value float64, from string) (float64, error) {
	switch from {
	case "c":
		return value, nil
	case "f":
		return (value - 32) * 5 / 9, nil
	case "k":
		return value - 273.15, nil
	default:
		return 0, fmt.Errorf("unsupported unit: %s", from)
	}
}

func fromCelsius(value float64, to string) (float64, error) {
	switch to {
	case "c":
		return value, nil
	case "f":
		return value*9/5 + 32, nil
	case "k":
		return value + 273.15, nil
	default:
		return 0, fmt.Errorf("unsupported unit: %s", to)
	}
}
