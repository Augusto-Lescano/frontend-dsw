const url = "http://localhost:3000/api/torneos";

export async function obtenerTorneos(){
    const res = await fetch(url);
    if (!res.ok) throw new Error("Error al obtener torneos");
    const data = await res.json();
    return data.data;
}

export async function obtenerUnTorneo(id: number){
    const res = await fetch(`${url}/${id}`);
    if (!res.ok) throw new Error("Error al obtener el torneo");
    const data = await res.json();
    return data.data;
}

export async function crearTorneo(torneo : any){
    const res = await fetch(url,{
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(torneo),
    });

    if(!res.ok) throw new Error("Error al crear el torneo");
    const data = await res.json();
    return data.data;
}

export async function eliminarTorneo(id: number){
    const res = await fetch(`${url}/${id}`,{
        method: "DELETE",
    });
    if (!res.ok) throw new Error("Error al eliminar  el torneo");
    return true;
}

export async function inscribirEnTorneo(torneoId: number, usuarioId: number, equipoId: number){
    
    const body: any = {};
    if (usuarioId) body.usuarioId = usuarioId;
    if (equipoId) body.equipoId = equipoId;
    
    const res = await fetch(`${url}/${torneoId}/inscribir`,{
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(body),
    });

    if(!res.ok) throw new Error("Error al crear el torneo");
    const data = await res.json();
    return data.data;
}