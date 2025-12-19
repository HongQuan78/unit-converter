package main

import (
	"html/template"
	"net/http"
	"strconv"
	"strings"
	"unit-converter/converter"
	converterstrategy "unit-converter/converter/strategy"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	tmpl := template.Must(template.New("").ParseGlob("templates/*.html"))
	template.Must(tmpl.ParseGlob("templates/partials/*.html"))
	r.SetHTMLTemplate(tmpl)

	r.Static("/static", "./static")

	r.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", gin.H{
			"title": "Unit Converter",
		})
	})

	r.POST("/convert-length", func(c *gin.Context) {
		handleConvert(c, converterstrategy.Length, "length", "from", "to", "length")
	})

	r.POST("/convert-weight", func(c *gin.Context) {
		handleConvert(c, converterstrategy.Weight, "weight", "weight-from", "weight-to", "weight")
	})

	r.POST("/convert-temp", func(c *gin.Context) {
		handleConvert(c, converterstrategy.Temperature, "temp", "temp-from", "temp-to", "temperature")
	})
	r.Run(":8080")
}

func handleConvert(
	c *gin.Context,
	unitType converterstrategy.UnitType,
	valueKey string,
	fromKey string,
	toKey string,
	valueLabel string,
) {
	paramValue := c.PostForm(valueKey)
	paramFrom := c.PostForm(fromKey)
	paramTo := c.PostForm(toKey)

	if strings.TrimSpace(paramValue) == "" {
		c.HTML(http.StatusBadRequest, "error.html", gin.H{
			"error": valueLabel + " is required",
		})
		return
	}

	if strings.TrimSpace(paramFrom) == "" || strings.TrimSpace(paramTo) == "" {
		c.HTML(http.StatusBadRequest, "error.html", gin.H{
			"error": "from/to units are required",
		})
		return
	}

	value, err := strconv.ParseFloat(paramValue, 64)
	if err != nil {
		c.HTML(http.StatusBadRequest, "error.html", gin.H{
			"error": valueLabel + " must be a number",
		})
		return
	}

	converterStrategy, err := converter.StrategyFor(unitType)
	if err != nil {
		c.HTML(http.StatusInternalServerError, "error.html", gin.H{
			"error": err.Error(),
		})
		return
	}

	result, err := converterStrategy.Convert(value, paramFrom, paramTo)
	if err != nil {
		c.HTML(200, "error.html", gin.H{
			"error": err.Error(),
		})
		return
	}

	c.HTML(200, "result.html", gin.H{
		"input":  value,
		"result": result,
		"from":   paramFrom,
		"to":     paramTo,
	})
}
