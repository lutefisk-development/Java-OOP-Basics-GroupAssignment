package com.company;

import server.database.Database;
import server.endpoints.Endpoints;

public class Main {

    public static void main(String[] args) {

        Database dbConnection = new Database();
        Endpoints endpoints = new Endpoints(dbConnection);

    }
}
