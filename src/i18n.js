import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
    en: {
        translation: {
            home: {
                tabPlaceholder: "Tab name...",
                todoPlaceholder: "Add new todo...",
                addButton: "Add",
                newTabButton: "+",
                deleteTab: "Delete Tab",
                deleteTabMessage:
                    "Are you sure you want to delete this tab? All todos in this tab will be lost.",
                cancel: "Cancel",
                delete: "Delete"
            }
        }
    },
    pl: {
        translation: {
            home: {
                tabPlaceholder: "Nazwa zakładki...",
                todoPlaceholder: "Dodaj nowe zadanie...",
                addButton: "Dodaj",
                newTabButton: "+",
                deleteTab: "Usuń zakładkę",
                deleteTabMessage:
                    "Czy na pewno chcesz usunąć tę zakładkę? Wszystkie zadania w tej zakładce zostaną utracone.",
                cancel: "Anuluj",
                delete: "Usuń"
            }
        }
    }
};

// eslint-disable-next-line import/no-named-as-default-member
i18n.use(initReactI18next).init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: {
        escapeValue: false
    }
});

export default i18n;
