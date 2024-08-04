package kroely.diy.mystock.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.Arrays;
import java.util.List;

@Component
public class RolesInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if (handler instanceof HandlerMethod handlerMethod) {
            RolesAllowed rolesAllowed = handlerMethod.getMethodAnnotation(RolesAllowed.class);

            if (rolesAllowed != null) {
                String rolesHeader = request.getHeader("ROLES");
                if (rolesHeader == null || rolesHeader.isEmpty()) {
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                    return false;
                }

                List<Integer> roleIds = Arrays.stream(rolesHeader.split(","))
                        .map(Integer::parseInt)
                        .toList();

                List<Roles> requiredRoles = Arrays.asList(rolesAllowed.value());
                boolean hasAccess = requiredRoles.stream()
                        .map(Enum::ordinal)
                        .anyMatch(roleIds::contains);

                if (!hasAccess) {
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                    return false;
                }
            }
        }
        return true;
    }
}
