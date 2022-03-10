module.exports = {
    purge: ["./src/**/*.{js,jsx,ts,tsx}", "./dist/popup.html"],
    content: ["./src/**/*.{html,js,tsx}"],
    theme: {
        extend: {
            colors: {
                "dark-gray": "#212121",
                "light-gray": "#606060",
            },
        },
    },
    plugins: [],
};
