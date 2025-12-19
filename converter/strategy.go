package converter

type ConverterStrategy interface {
	Convert(value float64, from string, to string) (float64, error)
}
