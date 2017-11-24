package org.examples.java;

import com.amazonaws.services.simplesystemsmanagement.AWSSimpleSystemsManagement;
import com.amazonaws.services.simplesystemsmanagement.AWSSimpleSystemsManagementClientBuilder;
import com.amazonaws.services.simplesystemsmanagement.model.GetParameterRequest;
import com.amazonaws.services.simplesystemsmanagement.model.GetParameterResult;

/**
 * Hello world!
 *
 * @author Arun Gupta
 */
public class App {
    public static void main(String[] args) {
        System.out.println("vault: "
                + getSecret("GREETING")
                + getSecret("NAME"));
    }

    private static String getSecret(String secret) {
        AWSSimpleSystemsManagement client= AWSSimpleSystemsManagementClientBuilder.defaultClient();
        GetParameterRequest request= new GetParameterRequest();
        request.setName(secret);
        request.setWithDecryption(true);
        GetParameterResult result = client.getParameter(request);
        return result.getParameter().getValue();
    }
}
