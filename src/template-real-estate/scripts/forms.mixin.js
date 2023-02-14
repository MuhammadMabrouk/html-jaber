export default {
  data() {
    return {};
  },
  mounted() {
    // initialize toggle all checkboxes
    this.initToggleAllCheckboxes();

    // custom input file
    this.customInputFile();
  },
  methods: {
    // initialize toggle all checkboxes
    initToggleAllCheckboxes() {
      [...document.querySelectorAll(".checkboxContainer--toggleAll")].forEach(el => {
        const toggler = el.querySelector("input");
        const subCheckboxes = [...el.nextSibling.querySelectorAll("input")];

        const checkSiblingsState = () => {
          if (subCheckboxes.every(sibling => sibling.checked)) {
            toggler.indeterminate = false;
            toggler.checked = true;
          } else if (subCheckboxes.every(sibling => !sibling.checked)) {
            toggler.indeterminate = false;
            toggler.checked = false;
          } else {
            toggler.indeterminate = true;
          }
        };
        const toggle = () => {
          subCheckboxes.forEach(checkbox => {
            if (toggler.checked) {
              checkbox.checked = true;

            } else if (!toggler.checked && !toggler.indeterminate) {
              checkbox.checked = false;
            }

            checkbox.onchange = checkSiblingsState;
          });
        };

        toggle();
        toggler.onchange = toggle;
      });
    },

    // custom input file
    customInputFile() {
      document.querySelectorAll(".fileUpload").forEach(el => {
        el.addEventListener("change", (e) => {
          const input = e.target;
          const label = input.parentElement;
          const placeholder = label.querySelector(".fileUpload__text__placeholder");
          const previewImgs = label.nextSibling;
          const files = input.files;
          const filesArr = [...files];
          const length = files?.length;

          placeholder.innerText = length ? filesArr.map(val => val.name).join(", ") : "";

          if (previewImgs.classList.contains("fileUpload__previewImgs")) {
            previewImgs.innerHTML = "";

            filesArr.forEach(file => {
              const li = document.createElement("li");
              const type = file.type.split("/")[0];
              let preview;

              if (type == "image") {
                preview = document.createElement("img");
                preview.alt = file.name;
              } else if (type == "video") {
                preview = document.createElement("video");
              }
              preview.src = URL.createObjectURL(file);

              li.className = type;
              li.appendChild(preview);
              previewImgs.appendChild(li);
            });

            previewImgs.removeAttribute("hidden");
          }
        });
      });
    },

    // display uploaded image
    displayUploadedImg(e, id, fbImg) {
      const file = e.target.files[0];
      const targetEl = document.getElementById(id);

      if (file) {
        targetEl.src = URL.createObjectURL(file);
        targetEl.alt = file.name;
      } else {
        targetEl.src = fbImg;
        targetEl.alt = "";
      }
    },

    // toggle password visibility
    togglePasswordVisibility(e) {
      const el = e.target;
      const passwordInput = el.parentElement.querySelector("input");

      if (passwordInput.getAttribute("type") === "password") {
        el.classList.remove("fa-eye");
        el.classList.add("fa-eye-slash");

        passwordInput.setAttribute("type", "text");
      } else {
        el.classList.remove("fa-eye-slash");
        el.classList.add("fa-eye");

        passwordInput.setAttribute("type", "password");
      }
    },
    // ============================

    // sign up form validation
    signUpFormValidation() {

      // sign up form
      const signUpForm  = this.$refs.signUpForm;

      // form controls
      const firstName         = signUpForm.querySelector("#firstName");
      const lastName          = signUpForm.querySelector("#lastName");
      const email             = signUpForm.querySelector("#email");
      const phoneNumber       = signUpForm.querySelector("#phoneNumber");
      const password          = signUpForm.querySelector("#password");
      const confirmPassword   = signUpForm.querySelector("#confirmPassword");
      const readTerms         = signUpForm.querySelector("#terms");

      // form validation status
      let errors = {
        firstName: { required: true, minLength: true },
        lastName: { required: true, minLength: true },
        email: { required: true, invalid: true },
        phoneNumber: { invalid: true },
        password: { required: true, minLength: true, hasSpaces: false },
        confirmPassword: { required: true, notEqual: false },
        readTerms: { required: true },
      };

      /* -------------------- */
      /* firstName validation */
      /* -------------------- */

      // required validation
      if (firstName.value === '') {
        errors.firstName.required = true;
        this.setNotify({
          id: 'firstNameRequired',
          className: 'danger',
          msg: firstName.closest('.control').querySelector('.errors-msgs .required').value
        });

      } else {
        errors.firstName.required = false;
        this.dismissNotify('firstNameRequired');
      }

      // minlength validation
      if (firstName.value.length > 0 && firstName.value.length < firstName.getAttribute('minlength')) {
        errors.firstName.minLength = true;
        this.setNotify({
          id: 'firstNameMinLength',
          className: 'danger',
          msg: firstName.closest('.control').querySelector('.errors-msgs .minLength').value
        });

      } else {
        errors.firstName.minLength = false;
        this.dismissNotify('firstNameMinLength');
      }

      // toggle invalid errors & style classes
      if (Object.keys(errors.firstName).some(err => errors.firstName[err] === true)) {
        firstName.classList.remove('valid');
        firstName.classList.add('invalid');
      } else {
        firstName.classList.remove('invalid');
        firstName.classList.add('valid');
      }

      /* ------------------- */
      /* lastName validation */
      /* ------------------- */

      // required validation
      if (lastName.value === '') {
        errors.lastName.required = true;
        this.setNotify({
          id: 'lastNameRequired',
          className: 'danger',
          msg: lastName.closest('.control').querySelector('.errors-msgs .required').value
        });

      } else {
        errors.lastName.required = false;
        this.dismissNotify('lastNameRequired');
      }

      // minlength validation
      if (lastName.value.length > 0 && lastName.value.length < lastName.getAttribute('minlength')) {
        errors.lastName.minLength = true;
        this.setNotify({
          id: 'lastNameMinLength',
          className: 'danger',
          msg: lastName.closest('.control').querySelector('.errors-msgs .minLength').value
        });

      } else {
        errors.lastName.minLength = false;
        this.dismissNotify('lastNameMinLength');
      }

      // toggle invalid errors & style classes
      if (Object.keys(errors.lastName).some(err => errors.lastName[err] === true)) {
        lastName.classList.remove('valid');
        lastName.classList.add('invalid');
      } else {
        lastName.classList.remove('invalid');
        lastName.classList.add('valid');
      }

      /* ---------------- */
      /* email validation */
      /* ---------------- */

      // required validation
      if (email.value === '') {
        errors.email.required = true;
        this.setNotify({
          id: 'emailRequired',
          className: 'danger',
          msg: email.closest('.control').querySelector('.errors-msgs .required').value
        });

      } else {
        errors.email.required = false;
        this.dismissNotify('emailRequired');
      }

      // email validation
      if (email.value.length > 0 && !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email.value)) {
        errors.email.invalid = true;
        this.setNotify({
          id: 'emailInvalid',
          className: 'danger',
          msg: email.closest('.control').querySelector('.errors-msgs .invalid').value
        });

      } else {
        errors.email.invalid = false;
        this.dismissNotify('emailInvalid');
      }

      // toggle invalid errors & style classes
      if (Object.keys(errors.email).some(err => errors.email[err] === true)) {
        email.classList.remove('valid');
        email.classList.add('invalid');
      } else {
        email.classList.remove('invalid');
        email.classList.add('valid');
      }

      /* ---------------------- */
      /* phoneNumber validation */
      /* ---------------------- */

      // phoneNumber validation
      if (phoneNumber.value.length > 0 && !/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(phoneNumber.value)) {
        errors.phoneNumber.invalid = true;
        this.setNotify({
          id: 'phoneNumberInvalid',
          className: 'danger',
          msg: phoneNumber.closest('.control').querySelector('.errors-msgs .invalid').value
        });

      } else {
        errors.phoneNumber.invalid = false;
        this.dismissNotify('phoneNumberInvalid');
      }

      // toggle invalid errors & style classes
      if (Object.keys(errors.phoneNumber).some(err => errors.phoneNumber[err] === true)) {
        phoneNumber.classList.remove('valid');
        phoneNumber.classList.add('invalid');
      } else {
        phoneNumber.classList.remove('invalid');
        phoneNumber.classList.add('valid');
      }

      /* ------------------- */
      /* password validation */
      /* ------------------- */

      // required validation
      if (password.value === '') {
        errors.password.required = true;
        this.setNotify({
          id: 'passwordRequired',
          className: 'danger',
          msg: password.closest('.control').querySelector('.errors-msgs .required').value
        });

      } else {
        errors.password.required = false;
        this.dismissNotify('passwordRequired');
      }

      // minlength validation
      if (password.value.length > 0 && password.value.length < password.getAttribute('minlength')) {
        errors.password.minLength = true;
        this.setNotify({
          id: 'passwordMinLength',
          className: 'danger',
          msg: password.closest('.control').querySelector('.errors-msgs .minLength').value
        });

      } else {
        errors.password.minLength = false;
        this.dismissNotify('passwordMinLength');
      }

      // cannot contain spaces validation
      if (password.value.indexOf(' ') > -1) {
        errors.password.hasSpaces = true;
        this.setNotify({
          id: 'passwordHasSpaces',
          className: 'danger',
          msg: password.closest('.control').querySelector('.errors-msgs .hasSpaces').value
        });

      } else {
        errors.password.hasSpaces = false;
        this.dismissNotify('passwordHasSpaces');
      }

      // toggle invalid errors & style classes
      if (Object.keys(errors.password).some(err => errors.password[err] === true)) {
        password.classList.remove('valid');
        password.classList.add('invalid');
      } else {
        password.classList.remove('invalid');
        password.classList.add('valid');
      }

      /* -------------------------- */
      /* confirmPassword validation */
      /* -------------------------- */

      // required validation
      if (confirmPassword.value === '') {
        errors.confirmPassword.required = true;
        this.setNotify({
          id: 'confirmPasswordRequired',
          className: 'danger',
          msg: confirmPassword.closest('.control').querySelector('.errors-msgs .required').value
        });

      } else {
        errors.confirmPassword.required = false;
        this.dismissNotify('confirmPasswordRequired');
      }

      // notEqual validation
      if (Object.keys(errors.password).every(err => errors.password[err] === false) && confirmPassword.value && confirmPassword.value !== password.value) {
        errors.confirmPassword.notEqual = true;
        this.setNotify({
          id: 'confirmPasswordNotEqual',
          className: 'danger',
          msg: confirmPassword.closest('.control').querySelector('.errors-msgs .notEqual').value
        });

      } else {
        errors.confirmPassword.notEqual = false;
        this.dismissNotify('confirmPasswordNotEqual');
      }

      // toggle invalid errors & style classes
      if (Object.keys(errors.confirmPassword).some(err => errors.confirmPassword[err] === true)) {
        confirmPassword.classList.remove('valid');
        confirmPassword.classList.add('invalid');
      } else {
        confirmPassword.classList.remove('invalid');
        confirmPassword.classList.add('valid');
      }

      /* --------------------- */
      /* read terms validation */
      /* --------------------- */

      // required validation
      if (!readTerms.checked) {
        errors.readTerms.required = true;
        this.setNotify({
          id: 'readTermsRequired',
          className: 'danger',
          msg: readTerms.closest('.control').querySelector('.errors-msgs .required').value
        });

      } else {
        errors.readTerms.required = false;
        this.dismissNotify('readTermsRequired');
      }

      // toggle invalid errors & style classes
      if (Object.keys(errors.readTerms).some(err => errors.readTerms[err] === true)) {
        readTerms.parentElement.parentElement.classList.remove('valid');
        readTerms.parentElement.parentElement.classList.add('invalid');
      } else {
        readTerms.parentElement.parentElement.classList.remove('invalid');
        readTerms.parentElement.parentElement.classList.add('valid');
      }

      // send the message if the form is valid
      (!Object.values(errors).some(control => Object.values(control).some(Boolean))) && this.signUpFormSubmit(signUpForm);
    },

    // sign up form submit
    signUpFormSubmit(form) {
      const url = form.getAttribute('action');
      const formData = new FormData(form);

      // start loading spinner
      this.startLoading();

      // send post request
      fetch(url, { method: 'POST', body: formData })
        .then(res => res.text())
        .then(data => {
          if (data === 'success') {
            // show success message
            this.setNotify({ className: 'success', msg: form.getAttribute('data-success-msg'), time: 5000 });

            // reset all form inputs
            form.reset();

            // remove inputs valid classes
            form.querySelectorAll('.valid').forEach(el => el.classList.remove('valid'));

          } else if (data === 'error') {
            // show error message
            this.setNotify({ className: 'danger', msg: form.getAttribute('data-err-msg'), time: 5000 });
          }

          // end loading spinner
          this.endLoading();

          console.log(data);
        })
        .catch(err => console.log(err));
    },
    // ============================

    // sign in form validation
    signInFormValidation() {

      // sign in form
      const signInForm  = this.$refs.signInForm;

      // form controls
      const email       = signInForm.querySelector("#email");
      const password    = signInForm.querySelector("#password");

      // form validation status
      let errors = {
        email: { required: true, invalid: true },
        password: { required: true },
      };

      /* ---------------- */
      /* email validation */
      /* ---------------- */

      // required validation
      if (email.value === '') {
        errors.email.required = true;
        this.setNotify({
          id: 'emailRequired',
          className: 'danger',
          msg: email.closest('.control').querySelector('.errors-msgs .required').value
        });

      } else {
        errors.email.required = false;
        this.dismissNotify('emailRequired');
      }

      // email validation
      if (email.value.length > 0 && !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email.value)) {
        errors.email.invalid = true;
        this.setNotify({
          id: 'emailInvalid',
          className: 'danger',
          msg: email.closest('.control').querySelector('.errors-msgs .invalid').value
        });

      } else {
        errors.email.invalid = false;
        this.dismissNotify('emailInvalid');
      }

      // toggle invalid errors & style classes
      if (Object.keys(errors.email).some(err => errors.email[err] === true)) {
        email.classList.remove('valid');
        email.classList.add('invalid');
      } else {
        email.classList.remove('invalid');
        email.classList.add('valid');
      }

      /* ------------------- */
      /* password validation */
      /* ------------------- */

      // required validation
      if (password.value === '') {
        errors.password.required = true;
        this.setNotify({
          id: 'passwordRequired',
          className: 'danger',
          msg: password.closest('.control').querySelector('.errors-msgs .required').value
        });

      } else {
        errors.password.required = false;
        this.dismissNotify('passwordRequired');
      }

      // toggle invalid errors & style classes
      if (Object.keys(errors.password).some(err => errors.password[err] === true)) {
        password.classList.remove('valid');
        password.classList.add('invalid');
      } else {
        password.classList.remove('invalid');
        password.classList.add('valid');
      }

      // send the message if the form is valid
      (!Object.values(errors).some(control => Object.values(control).some(Boolean))) && this.signInFormSubmit(signInForm);
    },

    // sign in form submit
    signInFormSubmit(form) {
      const url = form.getAttribute('action');
      const formData = new FormData(form);

      // start loading spinner
      this.startLoading();

      // send post request
      fetch(url, { method: 'POST', body: formData })
        .then(res => res.text())
        .then(data => {
          if (data === 'success') {
            // show success message
            this.setNotify({ className: 'success', msg: form.getAttribute('data-success-msg'), time: 5000 });

            // reset all form inputs
            form.reset();

            // remove inputs valid classes
            form.querySelectorAll('.valid').forEach(el => el.classList.remove('valid'));

          } else if (data === 'error') {
            // show error message
            this.setNotify({ className: 'danger', msg: form.getAttribute('data-err-msg'), time: 5000 });
          }

          // end loading spinner
          this.endLoading();

          console.log(data);
        })
        .catch(err => console.log(err));
    },
    // ============================

    // contact us form validation
    contactUsFormValidation() {

      // contact us form
      const contactUsForm  = this.$refs.contactUsForm;

      // form controls
      const name          = contactUsForm.querySelector("#name");
      const email         = contactUsForm.querySelector("#email");
      const phoneNumber   = contactUsForm.querySelector("#phoneNumber");
      const message       = contactUsForm.querySelector("#message");

      // form validation status
      let errors = {
        name: { required: true, minLength: true },
        email: { required: true, invalid: true },
        phoneNumber: { invalid: true },
        message: { required: true },
      };

      /* --------------- */
      /* name validation */
      /* --------------- */

      // required validation
      if (name.value === '') {
        errors.name.required = true;
        this.setNotify({
          id: 'nameRequired',
          className: 'danger',
          msg: name.closest('.control').querySelector('.errors-msgs .required').value
        });

      } else {
        errors.name.required = false;
        this.dismissNotify('nameRequired');
      }

      // minlength validation
      if (name.value.length > 0 && name.value.length < name.getAttribute('minlength')) {
        errors.name.minLength = true;
        this.setNotify({
          id: 'nameMinLength',
          className: 'danger',
          msg: name.closest('.control').querySelector('.errors-msgs .minLength').value
        });

      } else {
        errors.name.minLength = false;
        this.dismissNotify('nameMinLength');
      }

      // toggle invalid errors & style classes
      if (Object.keys(errors.name).some(err => errors.name[err] === true)) {
        name.classList.remove('valid');
        name.classList.add('invalid');
      } else {
        name.classList.remove('invalid');
        name.classList.add('valid');
      }

      /* ---------------- */
      /* email validation */
      /* ---------------- */

      // required validation
      if (email.value === '') {
        errors.email.required = true;
        this.setNotify({
          id: 'emailRequired',
          className: 'danger',
          msg: email.closest('.control').querySelector('.errors-msgs .required').value
        });

      } else {
        errors.email.required = false;
        this.dismissNotify('emailRequired');
      }

      // email validation
      if (email.value.length > 0 && !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email.value)) {
        errors.email.invalid = true;
        this.setNotify({
          id: 'emailInvalid',
          className: 'danger',
          msg: email.closest('.control').querySelector('.errors-msgs .invalid').value
        });

      } else {
        errors.email.invalid = false;
        this.dismissNotify('emailInvalid');
      }

      // toggle invalid errors & style classes
      if (Object.keys(errors.email).some(err => errors.email[err] === true)) {
        email.classList.remove('valid');
        email.classList.add('invalid');
      } else {
        email.classList.remove('invalid');
        email.classList.add('valid');
      }

      /* ---------------------- */
      /* phoneNumber validation */
      /* ---------------------- */

      // phoneNumber validation
      if (phoneNumber.value.length > 0 && !/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(phoneNumber.value)) {
        errors.phoneNumber.invalid = true;
        this.setNotify({
          id: 'phoneNumberInvalid',
          className: 'danger',
          msg: phoneNumber.closest('.control').querySelector('.errors-msgs .invalid').value
        });

      } else {
        errors.phoneNumber.invalid = false;
        this.dismissNotify('phoneNumberInvalid');
      }

      // toggle invalid errors & style classes
      if (Object.keys(errors.phoneNumber).some(err => errors.phoneNumber[err] === true)) {
        phoneNumber.classList.remove('valid');
        phoneNumber.classList.add('invalid');
      } else {
        phoneNumber.classList.remove('invalid');
        phoneNumber.classList.add('valid');
      }

      /* ------------------ */
      /* message validation */
      /* ------------------ */

      // required validation
      if (message.value === '') {
        errors.message.required = true;
        this.setNotify({
          id: 'messageRequired',
          className: 'danger',
          msg: message.closest('.control').querySelector('.errors-msgs .required').value
        });

      } else {
        errors.message.required = false;
        this.dismissNotify('messageRequired');
      }

      // toggle invalid errors & style classes
      if (Object.keys(errors.message).some(err => errors.message[err] === true)) {
        message.classList.remove('valid');
        message.classList.add('invalid');
      } else {
        message.classList.remove('invalid');
        message.classList.add('valid');
      }

      // send the message if the form is valid
      (!Object.values(errors).some(control => Object.values(control).some(Boolean))) && this.contactUsFormSubmit(contactUsForm);
    },

    // contact us form submit
    contactUsFormSubmit(form) {
      const url = form.getAttribute('action');
      const formData = new FormData(form);

      // start loading spinner
      this.startLoading();

      // send post request
      fetch(url, { method: 'POST', body: formData })
        .then(res => res.text())
        .then(data => {
          if (data === 'success') {
            // show success message
            this.setNotify({ className: 'success', msg: form.getAttribute('data-success-msg'), time: 5000 });

            // reset all form inputs
            form.reset();

            // remove inputs valid classes
            form.querySelectorAll('.valid').forEach(el => el.classList.remove('valid'));

          } else if (data === 'error') {
            // show error message
            this.setNotify({ className: 'danger', msg: form.getAttribute('data-err-msg'), time: 5000 });
          }

          // end loading spinner
          this.endLoading();

          console.log(data);
        })
        .catch(err => console.log(err));
    },
    // ============================

    // agent reviews form validation
    agentReviewsFormValidation() {

      // agent reviews form
      const agentReviewsForm  = this.$refs.agentReviewsForm;

      // form controls
      const rating          = agentReviewsForm.querySelector("input[name='rating']");
      const ratingChecked   = agentReviewsForm.querySelector("input[name='rating']:checked");

      // form validation status
      let errors = {
        rating: { required: true, },
      };

      /* ----------------- */
      /* rating validation */
      /* ----------------- */

      // required validation
      if (!ratingChecked) {
        errors.rating.required = true;
        this.setNotify({
          id: 'ratingRequired',
          className: 'danger',
          msg: rating.closest('.control').querySelector('.errors-msgs .required').value
        });

      } else {
        errors.rating.required = false;
        this.dismissNotify('ratingRequired');
      }

      // toggle invalid errors & style classes
      if (Object.keys(errors.rating).some(err => errors.rating[err] === true)) {
        rating.parentElement.parentElement.classList.remove('valid');
        rating.parentElement.parentElement.classList.add('invalid');
      } else {
        rating.parentElement.parentElement.classList.remove('invalid');
        rating.parentElement.parentElement.classList.add('valid');
      }

      // send the comment if the form is valid
      (!Object.values(errors).some(control => Object.values(control).some(Boolean))) && this.agentReviewsFormSubmit(agentReviewsForm);
    },

    // agent reviews form submit
    agentReviewsFormSubmit(form) {
      const url = form.getAttribute('action');
      const formData = new FormData(form);

      // start loading spinner
      this.startLoading();

      // send post request
      fetch(url, { method: 'POST', body: formData })
        .then(res => res.text())
        .then(data => {
          if (data === 'success') {
            // show success message
            this.setNotify({ className: 'success', msg: form.getAttribute('data-success-msg'), time: 5000 });

            // reset all form inputs
            form.reset();

            // remove inputs valid classes
            form.querySelectorAll('.valid').forEach(el => el.classList.remove('valid'));

          } else if (data === 'error') {
            // show error message
            this.setNotify({ className: 'danger', msg: form.getAttribute('data-err-msg'), time: 5000 });
          }

          // end loading spinner
          this.endLoading();

          console.log(data);
        })
        .catch(err => console.log(err));
    },
    // ============================

    // post comments form validation
    postCommentsFormValidation() {

      // post comments form
      const postCommentsForm  = this.$refs.postCommentsForm;

      // form controls
      const name          = postCommentsForm.querySelector("#name");
      const email         = postCommentsForm.querySelector("#email");
      const comment       = postCommentsForm.querySelector("#comment");

      // form validation status
      let errors = {
        name: { required: true, minLength: true },
        email: { required: true, invalid: true },
        comment: { required: true },
      };

      /* --------------- */
      /* name validation */
      /* --------------- */

      // required validation
      if (name.value === '') {
        errors.name.required = true;
        this.setNotify({
          id: 'nameRequired',
          className: 'danger',
          msg: name.closest('.control').querySelector('.errors-msgs .required').value
        });

      } else {
        errors.name.required = false;
        this.dismissNotify('nameRequired');
      }

      // minlength validation
      if (name.value.length > 0 && name.value.length < name.getAttribute('minlength')) {
        errors.name.minLength = true;
        this.setNotify({
          id: 'nameMinLength',
          className: 'danger',
          msg: name.closest('.control').querySelector('.errors-msgs .minLength').value
        });

      } else {
        errors.name.minLength = false;
        this.dismissNotify('nameMinLength');
      }

      // toggle invalid errors & style classes
      if (Object.keys(errors.name).some(err => errors.name[err] === true)) {
        name.classList.remove('valid');
        name.classList.add('invalid');
      } else {
        name.classList.remove('invalid');
        name.classList.add('valid');
      }

      /* ---------------- */
      /* email validation */
      /* ---------------- */

      // required validation
      if (email.value === '') {
        errors.email.required = true;
        this.setNotify({
          id: 'emailRequired',
          className: 'danger',
          msg: email.closest('.control').querySelector('.errors-msgs .required').value
        });

      } else {
        errors.email.required = false;
        this.dismissNotify('emailRequired');
      }

      // email validation
      if (email.value.length > 0 && !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email.value)) {
        errors.email.invalid = true;
        this.setNotify({
          id: 'emailInvalid',
          className: 'danger',
          msg: email.closest('.control').querySelector('.errors-msgs .invalid').value
        });

      } else {
        errors.email.invalid = false;
        this.dismissNotify('emailInvalid');
      }

      // toggle invalid errors & style classes
      if (Object.keys(errors.email).some(err => errors.email[err] === true)) {
        email.classList.remove('valid');
        email.classList.add('invalid');
      } else {
        email.classList.remove('invalid');
        email.classList.add('valid');
      }

      /* ------------------ */
      /* comment validation */
      /* ------------------ */

      // required validation
      if (comment.value === '') {
        errors.comment.required = true;
        this.setNotify({
          id: 'commentRequired',
          className: 'danger',
          msg: comment.closest('.control').querySelector('.errors-msgs .required').value
        });

      } else {
        errors.comment.required = false;
        this.dismissNotify('commentRequired');
      }

      // toggle invalid errors & style classes
      if (Object.keys(errors.comment).some(err => errors.comment[err] === true)) {
        comment.classList.remove('valid');
        comment.classList.add('invalid');
      } else {
        comment.classList.remove('invalid');
        comment.classList.add('valid');
      }

      // send the comment if the form is valid
      (!Object.values(errors).some(control => Object.values(control).some(Boolean))) && this.postCommentsFormSubmit(postCommentsForm);
    },

    // post comments form submit
    postCommentsFormSubmit(form) {
      const url = form.getAttribute('action');
      const formData = new FormData(form);

      // start loading spinner
      this.startLoading();

      // send post request
      fetch(url, { method: 'POST', body: formData })
        .then(res => res.text())
        .then(data => {
          if (data === 'success') {
            // show success message
            this.setNotify({ className: 'success', msg: form.getAttribute('data-success-msg'), time: 5000 });

            // reset all form inputs
            form.reset();

            // remove inputs valid classes
            form.querySelectorAll('.valid').forEach(el => el.classList.remove('valid'));

          } else if (data === 'error') {
            // show error message
            this.setNotify({ className: 'danger', msg: form.getAttribute('data-err-msg'), time: 5000 });
          }

          // end loading spinner
          this.endLoading();

          console.log(data);
        })
        .catch(err => console.log(err));
    },
    // ============================
  },
};
