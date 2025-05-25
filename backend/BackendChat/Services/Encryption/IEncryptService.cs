namespace BackendChat.Services.Encryption;

public interface IEncryptService
{
    string Encrypt(string value);
    bool Check(string hashedValue, string value);
}