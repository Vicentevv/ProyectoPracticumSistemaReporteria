export class TableRenderer {
  constructor(tableHeaderId, tableBodyId) {
      this.tableHeader = document.getElementById(tableHeaderId);
      this.tableBody = document.getElementById(tableBodyId);
      this.rows = []; // Hacer `rows` una propiedad de la clase
  }

  render(data) {
      const headers = [
          "Nombres", "Usuario", "Email", "Fecha_de_registro", "Hora_de_registro", "NombreReto",
          "DescripcionReto", "#Reto", "Intentos", "Fecha_inicio_reto", "hora_inicio_reto",
          "hora_fin_reto", "Aciertos", "Errores", "Estado"
      ];

      this.rows = []; // Reiniciar `rows` antes de llenarlo

      Object.entries(data).forEach(([userKey, userValue]) => {
          Object.entries(userValue).forEach(([username, userData]) => {
              const registros = userData.Registros || {};
              const retos = userData.Retos || {};

              const registroArray = Object.entries(registros).map(([registroKey, registro]) => {
                  const dateParts = registro.date?.split(";") || ["Hora no disponible", "Fecha no disponible"];
                  return {
                      ...registro,
                      Fecha_de_registro: dateParts[1]?.trim() || "Fecha no disponible",
                      Hora_de_registro: dateParts[0]?.trim() || "Hora no disponible"
                  };
              });

              const retosConHoraRegistro = this.assignRegistroHora(retos, registroArray);

              Object.entries(retosConHoraRegistro).forEach(([retoKey, retoData]) => {
                  Object.entries(retoData.Intentos || {}).forEach(([intentoKey, intento]) => {
                      const intentoFecha = intento.fecha_inicio?.split(";")[1]?.trim() || "Fecha no disponible";
                      const intentoHora = intento.fecha_inicio?.split(";")[0]?.trim() || "Hora no disponible";

                      let closestRegistro = null;
                      let smallestTimeDiff = Infinity;

                      registroArray.forEach(registro => {
                          if (registro.Fecha_de_registro === intentoFecha) {
                              const registroHora = registro.Hora_de_registro;
                              const registroTime = new Date(`1970-01-01T${registroHora}Z`).getTime();
                              const intentoTime = new Date(`1970-01-01T${intentoHora}Z`).getTime();
                              const timeDiff = Math.abs(registroTime - intentoTime);

                              if (timeDiff < smallestTimeDiff && registroTime <= intentoTime) {
                                  closestRegistro = registro;
                                  smallestTimeDiff = timeDiff;
                              }
                          }
                      });

                      if (closestRegistro) {
                          const baseRow = {
                              Nombres: closestRegistro.nombre || "Nombre no disponible",
                              Usuario: closestRegistro.username || "Usuario no disponible",
                              Email: closestRegistro.email || "Email no disponible",
                              Fecha_de_registro: closestRegistro.Fecha_de_registro,
                              Hora_de_registro: closestRegistro.Hora_de_registro,
                              NombreReto: intento.nombreReto || "No se asignó un reto",
                              DescripcionReto: intento.descripcionReto || "Sin descripción",
                              "#Reto": retoKey || "Sin número de reto",
                              Intentos: intento.intento || "Sin intentos registrados",
                              Fecha_inicio_reto: intentoFecha,
                              hora_inicio_reto: intentoHora,
                              hora_fin_reto: intento.fecha_final?.split(" ")[0]?.trim() || "Hora no disponible",
                              Aciertos: intento.aciertos || "0",
                              Errores: intento.errores || "0",
                              Estado: intento.estado || "Estado no disponible"
                          };
                          this.rows.push(baseRow);
                      }
                  });
              });

              registroArray.forEach(registro => {
                  const hasAssociatedRetos = this.rows.some(row => row.Fecha_de_registro === registro.Fecha_de_registro && row.Hora_de_registro === registro.Hora_de_registro);
                  if (!hasAssociatedRetos) {
                      this.rows.push({
                          Nombres: registro.nombre || "Nombre no disponible",
                          Usuario: registro.username || "Usuario no disponible",
                          Email: registro.email || "Email no disponible",
                          Fecha_de_registro: registro.Fecha_de_registro,
                          Hora_de_registro: registro.Hora_de_registro,
                          NombreReto: "",
                          DescripcionReto: "",
                          "#Reto": "",
                          Intentos: "",
                          Fecha_inicio_reto: "",
                          hora_inicio_reto: "",
                          hora_fin_reto: "",
                          Aciertos: "",
                          Errores: "",
                          Estado: ""
                      });
                  }
              });
          });
      });

      this.tableHeader.innerHTML = "";
      headers.forEach(header => {
          const th = document.createElement("th");
          th.textContent = header;
          this.tableHeader.appendChild(th);
      });

      this.tableBody.innerHTML = "";
      this.rows.forEach(row => {
          const tr = document.createElement("tr");
          headers.forEach(header => {
              const td = document.createElement("td");
              td.textContent = row[header] || "Dato no disponible";
              tr.appendChild(td);
          });
          this.tableBody.appendChild(tr);
      });
  }

  assignRegistroHora(retos, registroArray) {
      Object.entries(retos).forEach(([retoKey, retoData]) => {
          Object.entries(retoData.Intentos || {}).forEach(([intentoKey, intento]) => {
              const intentoInicio = intento.fecha_inicio;
          });
      });
      return retos;
  }

  generateCSV(fileName = "ReporteLaboratorioQuimica.csv") {
      if (!this.rows.length) {
          alert("No hay datos para descargar.");
          return;
      }

      const headers = Object.keys(this.rows[0]);
      const rows = this.rows.map(row => headers.map(header => row[header] || '').join(','));

      const csvContent = [
          headers.join(','), // Encabezados
          ...rows            // Filas de datos
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  }
}
