namespace NongSan.Application.Common;

public class Result<T>
{
    public bool IsSuccess { get; }
    public T? Data { get; }
    public string? ErrorMessage { get; }

    private Result(bool isSuccess, T? data, string? errorMessage)
    {
        IsSuccess = isSuccess;
        Data = data;
        ErrorMessage = errorMessage;
    }

    public static Result<T> Ok(T data) => new(true, data, null);
    public static Result<T> Fail(string errorMessage) => new(false, default, errorMessage);
}
