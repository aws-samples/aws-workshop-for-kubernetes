# First Helm Chart

This chart has a simple Java EE application that publishes a REST endpoint at `/resources/employees`. The resource returns a list of employees by querying a database.

The Java EE application is deployed as a JAR built using WildFly Swarm. MySQL is used as the backend database.

The application also publishes Prometheus-style metrics at `/metrics`.