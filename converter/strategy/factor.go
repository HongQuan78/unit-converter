package strategy

import (
	"fmt"
	"strings"
)

type FactorStrategy struct {
	toBase map[string]float64
}

func NewFactorStrategy(toBase map[string]float64) *FactorStrategy {
	return &FactorStrategy{toBase: toBase}
}

func (s *FactorStrategy) Convert(value float64, from, to string) (float64, error) {
	from = strings.ToLower(strings.TrimSpace(from))
	to = strings.ToLower(strings.TrimSpace(to))

	if s == nil || s.toBase == nil {
		return 0, fmt.Errorf("converter not initialized")
	}

	if from == "" || to == "" {
		return 0, fmt.Errorf("from/to units are required")
	}

	fromFactor, ok := s.toBase[from]
	if !ok {
		return 0, fmt.Errorf("unsupported unit: %s", from)
	}

	toFactor, ok := s.toBase[to]
	if !ok {
		return 0, fmt.Errorf("unsupported unit: %s", to)
	}

	baseValue := value * fromFactor
	result := baseValue / toFactor
	return result, nil
}
