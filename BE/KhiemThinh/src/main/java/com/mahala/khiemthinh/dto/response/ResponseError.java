package com.mahala.khiemthinh.dto.response;

import java.util.Date;

public class ResponseError {
    private Date timeStamp ;
    private int status ;
    private String message ;
    private String path ;
    private String error ;

    public Date getTimeStamp() {
        return timeStamp;
    }

    public int getStatus() {
        return status;
    }

    public String getMessage() {
        return message;
    }

    public String getPath() {
        return path;
    }

    public String getError() {
        return error;
    }

    public void setTimeStamp(Date timeStamp) {
        this.timeStamp = timeStamp;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public void setError(String error) {
        this.error = error;
    }
}
