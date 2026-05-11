const regex = /<MostrarEnNivel\s+(?:nivel=["']([^"']+)["']\s*)?(?:niveles=\{([^}]+)\}\s*)?>([\s\S]*?)<\/MostrarEnNivel>/g;
const str = `<MostrarEnNivel niveles={["Fundamentos"]}>
Hola
</MostrarEnNivel>`;
console.log(regex.exec(str));
