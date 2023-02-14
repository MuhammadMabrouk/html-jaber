export default {
  data() {
    return {};
  },
  mounted() {},
  methods: {
    // add property to compare
    addPropToCompare(e) {
      const el = e.currentTarget;
      const prop = el.closest(".propertyItem");
      const title = prop.querySelector(".propertyItem__body__title__link").textContent;
      const imgSrc = prop.querySelector(".propertyItem__imgBox__img").src;
      const compareBox = this.$refs.comparePropsBox;
      const compareBoxList = compareBox.querySelector(".compareProps__list");
      const children = [...compareBoxList.children];

      // return if the added element is exist
      if (compareBoxList.querySelector(`.${prop.id}`)) { return; }

      const li = document.createElement("li");
      const img = document.createElement("img");
      img.src = imgSrc;
      img.alt = title;
      li.className = "compareProps__list__item " + prop.id;
      li.title = title;
      li.appendChild(img);

      // remove first element if more than 3 elements
      if (children.length === 4) {
        const firstChild = children.at(0);
        const removedPropId = [...firstChild.classList].find(c => c.startsWith("property"));
        const removedProp = document.getElementById(removedPropId);

        removedProp.querySelector(".propertyItem__footer__actions__btn--compare").classList.remove("active");
        firstChild.remove();
      }

      // insert the new added element before the button
      children.at(-1).insertAdjacentHTML("beforebegin", li.outerHTML);

      el.classList.add("active");

      if (!compareBox.classList.contains("compareProps--open")) {
        compareBox.classList.add("compareProps--open");
      }
    },

    // close compare properties box
    closeComparePropsBox(e) {
      const el = e.currentTarget;
      const parent = el.parentElement;
      parent.classList.remove("compareProps--open");
    },
  },
};
