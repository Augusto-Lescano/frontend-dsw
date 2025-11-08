const url = "http://localhost:3000/api/tipoDeTorneo";

export async function obtenerTipoTorneos(){
    const res = await fetch(url);
    if (!res.ok) throw new Error("Error al obtener los tipos de torneos");
    const data = await res.json();
    return data.data;
}

export async function obtenerUnTipoTorneo(id: number){
    const res = await fetch(`${url}/${id}`);
    if (!res.ok) throw new Error("Error al obtener el tipo de torneo");
    const data = await res.json();
    return data.data;
}

export async function crearTipoTorneo(tipoTorneo : any){
    const res = await fetch(url,{
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(tipoTorneo),
    });

    if(!res.ok) throw new Error("Error al crear el tipo de torneo");
    const data = await res.json();
    return data.data;
}

export async function eliminarTipoTorneo(id: number){
    const res = await fetch(`${url}/${id}`,{
        method: "DELETE",
    });
    if (!res.ok) throw new Error("Error al eliminar el tipo de torneo");
    return true;
}