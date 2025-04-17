import Swal from "sweetalert2";

export function useSwalMessages() {
  const successMessage = (message:string) => {
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      toast: true,
      text: message,
      background: '#E8F8F8',
      showConfirmButton: false,
      timer: 4000,
    });
  };

  const errorMessage = (message:string) => {
    Swal.fire({
      position: 'top-end',
      icon: 'error',
      toast: true,
      text: message,
      background: '#F8E8F8',
      showConfirmButton: false,
      timer: 2000
    });
  };

  const confirmMessage = Swal.mixin({
    icon: 'warning',
    showCancelButton: true,
    cancelButtonText: `Cancelar`,
    confirmButtonText: "Confirmar",
    customClass: {
      title: 'swal-title',
      icon: 'swal-icon',
      confirmButton: 'btn noneb btn-success swal-confirm-button',
      cancelButton: 'btn noneb btn-danger swal-cancel-button',
    },
  });

  return { successMessage, errorMessage, confirmMessage };
}