class Response {
    constructor(data = null, message = null) {
        this.data = data;
        this.message = message;   
    }

    success(res) {
        return res.status(200).json({
            success: true,
            data: this.data,
            message: this.messsage ?? "Process is successful"
        });
    }

    created(res){
        return res.status(201).json({
            success:true,
            data:this.data,
            message: this.message ?? "Process is successful"
        });

    }

    error500(res) {
        return res.status(500).json({
            success:false,
            data: this.data,
            message: this.message ?? "Process is failed"
        });
    }

    error400(res) {
        return res.status(400).json({
            success: false,
            data: this.data,
            message: this.message ?? "Process is failed"
        });
    }

    error401(res) {
        return res.status(401).json({
            success: false,
            data: this.data,
            message: this.message ?? "Unauthorized Transaction. Please login..."
        })
    }

    error404(res) {
        return res.status(404).json({
            success: false,
            data: this.data,
            message: this.message ?? "Nothing Found. Process is failed"
        })
    }

    error429(res) {
        return res.status(429).json({
            success: false,
            data: this.data,
            message: this.message ?? "Too much request is sent"

        })

    }
}

module.exports  = Response;