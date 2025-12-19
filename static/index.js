(() => {
  const forms = document.querySelectorAll("form");
  if (!window.JustValidate) {
    forms.forEach((form) =>
      form.addEventListener(
        "submit",
        (event) => {
          event.preventDefault();
          event.stopPropagation();
        },
        true
      )
    );
    return;
  }

  const resultBox = document.querySelector("#result");

  const showMessage = (message) => {
    if (resultBox) {
      resultBox.textContent = message;
    }
  };

  const makeValidator = (formSelector, fields, onSuccess) => {
    const form = document.querySelector(formSelector);
    if (!form) return;

    form.setAttribute("novalidate", "novalidate");
    form.setAttribute("hx-disable", "true");
    form.setAttribute("data-hx-disabled", "true");
    form.setAttribute("hx-trigger", "none");
    form.setAttribute("data-hx-trigger", "none");

    const validator = new JustValidate(form, {
      errorFieldCssClass: "input-error",
      errorLabelCssClass: "field-error",
      focusInvalidField: true,
      lockForm: true,
      validateAfterInput: true,
      validateBeforeSubmitting: true,
    });

    fields.forEach((field) => {
      validator.addField(field.selector, field.rules);
    });

    form.addEventListener(
      "submit",
      (event) => {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        validator.revalidate().then((isValid) => {
          if (!isValid) return;
          onSuccess?.(form);
        });
      },
      true
    );
  };

  const formConfigs = [
    {
      selector: "#length-form",
      fields: [
        {
          selector: "#length-value",
          rules: [
            { rule: "required", errorMessage: "Please enter a value." },
            {
              rule: "number",
              errorMessage: "Please enter a valid number.",
            },
            {
              rule: "minNumber",
              value: 0,
              errorMessage: "Number must be 0 or greater.",
            },
          ],
        },
        {
          selector: "#length-from",
          rules: [
            { rule: "required", errorMessage: "Please enter a unit." },
            {
              rule: "customRegexp",
              value: /^(mm|cm|m|km|in|ft)$/i,
              errorMessage: "Use: mm, cm, m, km, in, ft.",
            },
          ],
        },
        {
          selector: "#length-to",
          rules: [
            { rule: "required", errorMessage: "Please enter a unit." },
            {
              rule: "customRegexp",
              value: /^(mm|cm|m|km|in|ft)$/i,
              errorMessage: "Use: mm, cm, m, km, in, ft.",
            },
          ],
        },
      ],
      onSuccess: (form) => {
        if (!window.htmx) {
          showMessage("Conversion requires JavaScript to be enabled.");
          return;
        }

        const target = form.getAttribute("data-hx-target") || "#result";
        const swap = form.getAttribute("data-hx-swap") || "innerHTML";
        const url = form.getAttribute("data-hx-post") || "/convert-length";

        const values = Object.fromEntries(new FormData(form));
        htmx.ajax("POST", url, {
          target,
          swap,
          values,
        });
      },
    },
    {
      selector: "#weight-form",
      fields: [
        {
          selector: "#weight-value",
          rules: [
            { rule: "required", errorMessage: "Please enter a value." },
            {
              rule: "number",
              errorMessage: "Please enter a valid number.",
            },
            {
              rule: "minNumber",
              value: 0,
              errorMessage: "Number must be 0 or greater.",
            },
          ],
        },
        {
          selector: "#weight-from",
          rules: [
            { rule: "required", errorMessage: "Please enter a unit." },
            {
              rule: "customRegexp",
              value: /^(g|kg|lb|oz)$/i,
              errorMessage: "Use: g, kg, lb, oz.",
            },
          ],
        },
        {
          selector: "#weight-to",
          rules: [
            { rule: "required", errorMessage: "Please enter a unit." },
            {
              rule: "customRegexp",
              value: /^(g|kg|lb|oz)$/i,
              errorMessage: "Use: g, kg, lb, oz.",
            },
          ],
        },
      ],
      onSuccess: (form) => {
        if (!window.htmx) {
          showMessage("Conversion requires JavaScript to be enabled.");
          return;
        }

        const target = form.getAttribute("data-hx-target") || "#result";
        const swap = form.getAttribute("data-hx-swap") || "innerHTML";
        const url = form.getAttribute("data-hx-post") || "/convert-weight";

        const values = Object.fromEntries(new FormData(form));
        htmx.ajax("POST", url, {
          target,
          swap,
          values,
        });
      },
    },
    {
      selector: "#temperature-form",
      fields: [
        {
          selector: "#temp-value",
          rules: [
            { rule: "required", errorMessage: "Please enter a value." },
            {
              rule: "number",
              errorMessage: "Please enter a valid number.",
            },
          ],
        },
        {
          selector: "#temp-from",
          rules: [
            { rule: "required", errorMessage: "Please enter a unit." },
            {
              rule: "customRegexp",
              value: /^(c|f|k)$/i,
              errorMessage: "Use: C, F, or K.",
            },
          ],
        },
        {
          selector: "#temp-to",
          rules: [
            { rule: "required", errorMessage: "Please enter a unit." },
            {
              rule: "customRegexp",
              value: /^(c|f|k)$/i,
              errorMessage: "Use: C, F, or K.",
            },
          ],
        },
      ],
      onSuccess: (form) => {
        if (!window.htmx) {
          showMessage("Conversion requires JavaScript to be enabled.");
          return;
        }

        const target = form.getAttribute("data-hx-target") || "#result";
        const swap = form.getAttribute("data-hx-swap") || "innerHTML";
        const url = form.getAttribute("data-hx-post") || "/convert-temp";

        const values = Object.fromEntries(new FormData(form));
        htmx.ajax("POST", url, {
          target,
          swap,
          values,
        });
      },
    },
  ];

  formConfigs.forEach((config) =>
    makeValidator(config.selector, config.fields, config.onSuccess)
  );
})();
