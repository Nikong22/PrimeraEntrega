const esAdmin = false;
export default function(req, res, next){
	const ruta = req.route.path
	const metodo = req.route.stack[0].method
	if(!esAdmin){
		return res.status(500).json({
			error: -1,
			descripcion: `no tiene permisos de administrador para la ruta `+ruta+` por `+metodo
		});
	}
	next();
};