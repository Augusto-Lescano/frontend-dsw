const url = "http://localhost:3000/api/juego";

export async function obtenerJuegos(){
    const res = await fetch(url);
    if (!res.ok) throw new Error("Error al obtener juegos");
    const data = await res.json();
    return data.data;
}

export async function obtenerUnJuego(id: number){
    const res = await fetch(`${url}/${id}`);
    if (!res.ok) throw new Error("Error al obtener el juego");
    const data = await res.json();
    return data.data;
}

export async function crearJuego(juego : any){
    const res = await fetch(url,{
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(juego),
    });

    if(!res.ok) throw new Error("Error al crear el juego");
    const data = await res.json();
    return data.data;
}

export async function eliminarJuego(id: number){
    const res = await fetch(`${url}/${id}`,{
        method: "DELETE",
    });
    if (!res.ok) throw new Error("Error al eliminar el juego");
    return true;
}