# Unit Converter

A simple Go + Gin web app that converts length, weight, and temperature units.
It uses a strategy pattern to keep conversion logic clean and extensible.

## Features

- Length, weight, and temperature conversion
- Strategy-based conversion logic
- HTMX + JustValidate front-end
- Clean UI with tabs

## Requirements

- Go 1.25+

## Run locally

```bash
go run .
```

Open http://localhost:8080

## Endpoints

- `GET /` - UI page
- `POST /convert-length`
- `POST /convert-weight`
- `POST /convert-temp`

## Project structure

```
.
├─ converter/
│  ├─ factory.go
│  ├─ strategy.go
│  └─ strategy/
│     ├─ factor.go
│     ├─ temperature.go
│     └─ unit_type.go
├─ static/
├─ templates/
└─ main.go
```

## Strategy pattern

- `ConverterStrategy` defines a `Convert(...)` contract.
- `FactorStrategy` handles units with a factor map (length, weight).
- `TemperatureStrategy` handles C/F/K conversions.
- `StrategyFor(...)` returns the correct strategy for a unit type.

## Input notes

- Length units: `mm`, `cm`, `m`, `km`, `in`, `ft`
- Weight units: `g`, `kg`, `lb`, `oz`
- Temperature units: `c`, `f`, `k`
- Input is case-insensitive and trimmed.

## Troubleshooting

- If you see 400 errors, make sure the form values are sent and units match the supported list.
- If JS is disabled, the app will not submit via HTMX.
