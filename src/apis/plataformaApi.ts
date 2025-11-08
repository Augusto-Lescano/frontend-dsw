const url = "http://localhost:3000/api/plataforma";

export async function obtenerPlataformas(){
    const res = await fetch(url);
    if (!res.ok) throw new Error("Error al obtener plataformas");
    const data = await res.json();
    return data.data;
}

export async function obtenerUnaPlataforma(id: number){
    const res = await fetch(`${url}/${id}`);
    if (!res.ok) throw new Error("Error al obtener la plataforma");
    const data = await res.json();
    return data.data;
}

export async function crearPlataforma(plataforma : any){
    const res = await fetch(url,{
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(plataforma),
    });

    if(!res.ok) throw new Error("Error al crear la plataforma");
    const data = await res.json();
    return data.data;
}

export async function eliminarPlataforma(id: number){
    const res = await fetch(`${url}/${id}`,{
        method: "DELETE",
    });
    if (!res.ok) throw new Error("Error al eliminar la plataforma");
    return true;
}