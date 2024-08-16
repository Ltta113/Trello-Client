import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { useState } from 'react'
import PasswordInput from '~/components/PasswordInput/PasswordInput'
import { changePasswordAPI } from '~/redux/userSlice' // Điều chỉnh đường dẫn theo thực tế của bạn
import { toast } from 'react-toastify'
import { useAppDispatch } from '~/redux/store'

export default function Security() {
  const [password, setPassword] = useState<string>('')
  const [newPassword, setNewPassword] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  const dispatch = useAppDispatch()

  const isButtonDisabled = password.trim() === '' || newPassword.trim() === ''

  const handleChangePassword = async () => {
    setError(null)
    try {
      const data = {
        password,
        newPassword
      }
      const resultAction = await dispatch(changePasswordAPI(data))

      if (changePasswordAPI.rejected.match(resultAction)) {
        const payload = resultAction.payload as unknown

        if (payload && typeof payload === 'string') {
          setError(payload || 'Có lỗi xảy ra')
        }
      } else {
        toast.success('Thay đổi mật khẩu thành công')
        setPassword('')
        setNewPassword('')
      }
    } catch (error) {
      toast.error(`Error: ${error}`)
    }
  }
  return (
    <Box>
      <Box sx={{ fontSize: 26, fontWeight: '500', pt: 4, pb: 5 }}>Bảo mật</Box>
      <Box sx={{ fontSize: 14, fontWeight: '500', pb: 1 }}>Thay đổi mật khẩu</Box>
      <Box sx={{ fontSize: 14, pb: 2 }}>
        Khi bạn đổi mật khẩu, chúng tôi sẽ vẫn duy trì trạng thái đăng nhập của bạn trên thiết bị
        này nhưng đăng xuất bạn khỏi các thiết bị khác.
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <PasswordInput
          password={password}
          title="Mật khẩu hiện tại"
          setPassword={setPassword}
          error={error} // Truyền lỗi vào ô nhập mật khẩu hiện tại
        />
        <PasswordInput password={newPassword} title="Mật khẩu mới" setPassword={setNewPassword} />
        <Button
          variant="contained"
          disabled={isButtonDisabled}
          sx={{ width: '104px', height: '32px', p: '10px 0px 10px 0px' }}
          onClick={handleChangePassword} // Thực hiện thay đổi mật khẩu khi nhấn nút
        >
          Lưu thay đổi
        </Button>
      </Box>
    </Box>
  )
}
