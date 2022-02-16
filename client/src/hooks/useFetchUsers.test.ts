import {act, renderHook} from "@testing-library/react-hooks";

import useFetchUsers from "./useFetchUsers";

test("not logged in should return zero users", () => {

    const {result} = renderHook(() => useFetchUsers({
        active: false,
        alertPopup: false,
        currentPage: 1,
        pageSize: 10,
    }));

    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBeFalsy();
    expect(result.current.users).not.toBeNull();
    // Must be logged in as superuser to get results
    expect(result.current.users.length).toBe(0);

});

