package converter

import (
	"fmt"
	"unit-converter/converter/strategy"
)

func StrategyFor(unitType strategy.UnitType) (ConverterStrategy, error) {
	switch unitType {
	case strategy.Length:
		return strategy.NewFactorStrategy(map[string]float64{
				"mm": 0.001,
				"cm": 0.01,
				"m":  1,
				"km": 1000,
				"in": 0.0254,
				"ft": 0.3048,
			}), nil
	case strategy.Weight:
		return strategy.NewFactorStrategy(map[string]float64{
				"g":  0.001,
				"kg": 1,
				"lb": 0.45359237,
				"oz": 0.028349523125,
			}), nil
	case strategy.Temperature:
		return &strategy.TemperatureStrategy{}, nil
	default:
		return nil, fmt.Errorf("unsupported unit type: %s", unitType)
	}
}
