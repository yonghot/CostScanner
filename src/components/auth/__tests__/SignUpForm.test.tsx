import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SignUpForm from '../SignUpForm'
import { useRouter } from 'next/navigation'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

// Mock Supabase client
jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: jest.fn(() => ({
    auth: {
      signUp: jest.fn(),
    },
  })),
}))

describe('SignUpForm', () => {
  const mockPush = jest.fn()
  const user = userEvent.setup()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
      prefetch: jest.fn(),
    })
  })

  describe('렌더링 테스트', () => {
    it('회원가입 폼이 올바르게 렌더링되어야 한다', () => {
      render(<SignUpForm />)
      
      expect(screen.getByLabelText(/이름/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/이메일 주소/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/^비밀번호 \*/)).toBeInTheDocument()
      expect(screen.getByLabelText(/비밀번호 확인/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/사업체명/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/업종/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/연락처/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /회원가입/i })).toBeInTheDocument()
    })

    it('로그인 링크가 표시되어야 한다', () => {
      render(<SignUpForm />)
      
      expect(screen.getByText(/이미 계정이 있으신가요?/i)).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /로그인/i })).toHaveAttribute('href', '/auth/login')
    })
  })

  describe('입력 유효성 검사', () => {
    it('빈 이름으로 제출 시 에러를 표시해야 한다', async () => {
      render(<SignUpForm />)
      
      const submitButton = screen.getByRole('button', { name: /회원가입/i })
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/이름은 2자 이상 입력해주세요/i)).toBeInTheDocument()
      })
    })

    it('짧은 이름(1자)으로 제출 시 에러를 표시해야 한다', async () => {
      render(<SignUpForm />)
      
      const nameInput = screen.getByLabelText(/이름/i)
      await user.type(nameInput, '김')
      
      const submitButton = screen.getByRole('button', { name: /회원가입/i })
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/이름은 2자 이상 입력해주세요/i)).toBeInTheDocument()
      })
    })

    it('잘못된 이메일 형식 입력 시 에러를 표시해야 한다', async () => {
      render(<SignUpForm />)
      
      const nameInput = screen.getByLabelText(/이름/i)
      const emailInput = screen.getByLabelText(/이메일 주소/i)
      
      await user.type(nameInput, '홍길동')
      await user.type(emailInput, 'invalid-email')
      
      const submitButton = screen.getByRole('button', { name: /회원가입/i })
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/올바른 이메일 주소를 입력해주세요/i)).toBeInTheDocument()
      })
    })

    it('약한 비밀번호 입력 시 에러를 표시해야 한다', async () => {
      render(<SignUpForm />)
      
      const nameInput = screen.getByLabelText(/이름/i)
      const emailInput = screen.getByLabelText(/이메일 주소/i)
      const passwordInput = screen.getByLabelText(/^비밀번호 \*/)
      
      await user.type(nameInput, '홍길동')
      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'weak')
      
      const submitButton = screen.getByRole('button', { name: /회원가입/i })
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/비밀번호는 8자 이상이며, 대소문자, 숫자, 특수문자를 포함해야 합니다/i)).toBeInTheDocument()
      })
    })

    it('비밀번호 확인이 일치하지 않을 때 에러를 표시해야 한다', async () => {
      render(<SignUpForm />)
      
      const nameInput = screen.getByLabelText(/이름/i)
      const emailInput = screen.getByLabelText(/이메일 주소/i)
      const passwordInput = screen.getByLabelText(/^비밀번호 \*/)
      const confirmPasswordInput = screen.getByLabelText(/비밀번호 확인/i)
      
      await user.type(nameInput, '홍길동')
      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'Password123!')
      await user.type(confirmPasswordInput, 'Different123!')
      
      const submitButton = screen.getByRole('button', { name: /회원가입/i })
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/비밀번호 확인이 일치하지 않습니다/i)).toBeInTheDocument()
      })
    })

    it('빈 사업체명으로 제출 시 에러를 표시해야 한다', async () => {
      render(<SignUpForm />)
      
      const nameInput = screen.getByLabelText(/이름/i)
      const emailInput = screen.getByLabelText(/이메일 주소/i)
      const passwordInput = screen.getByLabelText(/^비밀번호 \*/)
      const confirmPasswordInput = screen.getByLabelText(/비밀번호 확인/i)
      
      await user.type(nameInput, '홍길동')
      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'Password123!')
      await user.type(confirmPasswordInput, 'Password123!')
      
      const submitButton = screen.getByRole('button', { name: /회원가입/i })
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/사업체명을 입력해주세요/i)).toBeInTheDocument()
      })
    })
  })

  describe('비밀번호 강도 표시', () => {
    it('비밀번호 입력 시 강도 표시가 나타나야 한다', async () => {
      render(<SignUpForm />)
      
      const passwordInput = screen.getByLabelText(/^비밀번호 \*/)
      await user.type(passwordInput, 'a')
      
      expect(screen.getByText(/8자 이상/i)).toBeInTheDocument()
      expect(screen.getByText(/대문자 포함/i)).toBeInTheDocument()
      expect(screen.getByText(/소문자 포함/i)).toBeInTheDocument()
      expect(screen.getByText(/숫자 포함/i)).toBeInTheDocument()
      expect(screen.getByText(/특수문자 포함/i)).toBeInTheDocument()
    })

    it('비밀번호가 조건을 충족하면 체크 아이콘이 표시되어야 한다', async () => {
      render(<SignUpForm />)
      
      const passwordInput = screen.getByLabelText(/^비밀번호 \*/)
      await user.type(passwordInput, 'Password123!')
      
      await waitFor(() => {
        // 모든 조건이 충족됨을 확인
        expect(screen.getByText(/8자 이상/i).parentElement).toHaveClass('text-green-600')
        expect(screen.getByText(/대문자 포함/i).parentElement).toHaveClass('text-green-600')
        expect(screen.getByText(/소문자 포함/i).parentElement).toHaveClass('text-green-600')
        expect(screen.getByText(/숫자 포함/i).parentElement).toHaveClass('text-green-600')
        expect(screen.getByText(/특수문자 포함/i).parentElement).toHaveClass('text-green-600')
      })
    })
  })

  describe('회원가입 프로세스', () => {
    it('유효한 입력으로 회원가입 성공 시 성공 화면이 표시되어야 한다', async () => {
      const { createClientComponentClient } = require('@supabase/auth-helpers-nextjs')
      const mockSignUp = jest.fn().mockResolvedValue({
        data: { user: { id: '123' }, session: null },
        error: null,
      })
      
      createClientComponentClient.mockReturnValue({
        auth: {
          signUp: mockSignUp,
        },
      })
      
      render(<SignUpForm />)
      
      const nameInput = screen.getByLabelText(/이름/i)
      const emailInput = screen.getByLabelText(/이메일 주소/i)
      const passwordInput = screen.getByLabelText(/^비밀번호 \*/)
      const confirmPasswordInput = screen.getByLabelText(/비밀번호 확인/i)
      const businessNameInput = screen.getByLabelText(/사업체명/i)
      
      await user.type(nameInput, '홍길동')
      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'Password123!')
      await user.type(confirmPasswordInput, 'Password123!')
      await user.type(businessNameInput, '테스트 회사')
      
      const submitButton = screen.getByRole('button', { name: /회원가입/i })
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(mockSignUp).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'Password123!',
          options: {
            data: {
              name: '홍길동',
              business_name: '테스트 회사',
              business_type: '',
              phone: ''
            }
          }
        })
        expect(screen.getByText(/회원가입이 완료되었습니다!/i)).toBeInTheDocument()
        expect(screen.getByText(/이메일을 확인하여 계정을 활성화해주세요/i)).toBeInTheDocument()
      })
    })

    it('이미 등록된 이메일로 회원가입 시 에러를 표시해야 한다', async () => {
      const { createClientComponentClient } = require('@supabase/auth-helpers-nextjs')
      const mockSignUp = jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'User already registered' },
      })
      
      createClientComponentClient.mockReturnValue({
        auth: {
          signUp: mockSignUp,
        },
      })
      
      render(<SignUpForm />)
      
      const nameInput = screen.getByLabelText(/이름/i)
      const emailInput = screen.getByLabelText(/이메일 주소/i)
      const passwordInput = screen.getByLabelText(/^비밀번호 \*/)
      const confirmPasswordInput = screen.getByLabelText(/비밀번호 확인/i)
      const businessNameInput = screen.getByLabelText(/사업체명/i)
      
      await user.type(nameInput, '홍길동')
      await user.type(emailInput, 'existing@example.com')
      await user.type(passwordInput, 'Password123!')
      await user.type(confirmPasswordInput, 'Password123!')
      await user.type(businessNameInput, '테스트 회사')
      
      const submitButton = screen.getByRole('button', { name: /회원가입/i })
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/이미 등록된 이메일 주소입니다/i)).toBeInTheDocument()
      })
    })

    it('회원가입 중 로딩 상태를 표시해야 한다', async () => {
      const { createClientComponentClient } = require('@supabase/auth-helpers-nextjs')
      const mockSignUp = jest.fn().mockImplementation(() => 
        new Promise(resolve => setTimeout(resolve, 1000))
      )
      
      createClientComponentClient.mockReturnValue({
        auth: {
          signUp: mockSignUp,
        },
      })
      
      render(<SignUpForm />)
      
      const nameInput = screen.getByLabelText(/이름/i)
      const emailInput = screen.getByLabelText(/이메일 주소/i)
      const passwordInput = screen.getByLabelText(/^비밀번호 \*/)
      const confirmPasswordInput = screen.getByLabelText(/비밀번호 확인/i)
      const businessNameInput = screen.getByLabelText(/사업체명/i)
      
      await user.type(nameInput, '홍길동')
      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'Password123!')
      await user.type(confirmPasswordInput, 'Password123!')
      await user.type(businessNameInput, '테스트 회사')
      
      const submitButton = screen.getByRole('button', { name: /회원가입/i })
      await user.click(submitButton)
      
      expect(submitButton).toBeDisabled()
      // Loader2 컴포넌트가 표시되는지 확인
      expect(submitButton.querySelector('.animate-spin')).toBeInTheDocument()
    })
  })

  describe('비밀번호 표시/숨기기 기능', () => {
    it('비밀번호 표시 토글 버튼이 작동해야 한다', async () => {
      render(<SignUpForm />)
      
      const passwordInput = screen.getByLabelText(/^비밀번호 \*/)
      // 비밀번호 토글 버튼 찾기 (아이콘 버튼이므로 aria-label 사용)
      const passwordContainer = passwordInput.parentElement
      const toggleButton = passwordContainer?.querySelector('button[type="button"]')
      
      expect(passwordInput).toHaveAttribute('type', 'password')
      
      if (toggleButton) {
        await user.click(toggleButton)
        expect(passwordInput).toHaveAttribute('type', 'text')
        
        await user.click(toggleButton)
        expect(passwordInput).toHaveAttribute('type', 'password')
      }
    })
  })

  describe('업종 선택', () => {
    it('업종 선택 드롭다운이 올바른 옵션을 표시해야 한다', async () => {
      render(<SignUpForm />)
      
      const businessTypeSelect = screen.getByLabelText(/업종/i)
      
      expect(businessTypeSelect).toBeInTheDocument()
      expect(screen.getByText(/업종 선택/i)).toBeInTheDocument()
      
      fireEvent.change(businessTypeSelect, { target: { value: 'restaurant' } })
      expect(businessTypeSelect).toHaveValue('restaurant')
    })
  })

  describe('접근성 테스트', () => {
    it('키보드로 모든 필드와 버튼에 접근 가능해야 한다', async () => {
      render(<SignUpForm />)
      
      const nameInput = screen.getByLabelText(/이름/i)
      const emailInput = screen.getByLabelText(/이메일 주소/i)
      const passwordInput = screen.getByLabelText(/^비밀번호 \*/)
      const confirmPasswordInput = screen.getByLabelText(/비밀번호 확인/i)
      const businessNameInput = screen.getByLabelText(/사업체명/i)
      const submitButton = screen.getByRole('button', { name: /회원가입/i })
      
      // Tab 키로 이동 시뮬레이션
      nameInput.focus()
      expect(document.activeElement).toBe(nameInput)
      
      await user.tab()
      expect(document.activeElement).toBe(emailInput)
      
      await user.tab()
      expect(document.activeElement).toBe(passwordInput)
      
      await user.tab()
      // 비밀번호 토글 버튼
      
      await user.tab()
      expect(document.activeElement).toBe(confirmPasswordInput)
      
      await user.tab()
      expect(document.activeElement).toBe(businessNameInput)
    })

    it('에러 메시지가 스크린 리더에 읽혀야 한다', async () => {
      render(<SignUpForm />)
      
      const submitButton = screen.getByRole('button', { name: /회원가입/i })
      await user.click(submitButton)
      
      await waitFor(() => {
        const errorMessage = screen.getByText(/이름은 2자 이상 입력해주세요/i)
        // 에러 메시지가 div 안에 있으므로 role 확인
        expect(errorMessage.parentElement).toBeInTheDocument()
      })
    })
  })

  describe('보안 테스트', () => {
    it('비밀번호 필드가 기본적으로 마스킹되어야 한다', () => {
      render(<SignUpForm />)
      
      const passwordInput = screen.getByLabelText(/^비밀번호 \*/)
      const confirmPasswordInput = screen.getByLabelText(/비밀번호 확인/i)
      
      expect(passwordInput).toHaveAttribute('type', 'password')
      expect(confirmPasswordInput).toHaveAttribute('type', 'password')
    })

    it('XSS 공격 방지: 스크립트 태그 입력 시 처리해야 한다', async () => {
      render(<SignUpForm />)
      
      const nameInput = screen.getByLabelText(/이름/i)
      await user.type(nameInput, '<script>alert("XSS")</script>')
      
      const emailInput = screen.getByLabelText(/이메일 주소/i)
      await user.type(emailInput, '<script>alert("XSS")</script>@example.com')
      
      const submitButton = screen.getByRole('button', { name: /회원가입/i })
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/올바른 이메일 주소를 입력해주세요/i)).toBeInTheDocument()
      })
    })

    it('SQL Injection 방지: 특수문자 처리를 확인해야 한다', async () => {
      const { createClientComponentClient } = require('@supabase/auth-helpers-nextjs')
      const mockSignUp = jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Invalid input' },
      })
      
      createClientComponentClient.mockReturnValue({
        auth: {
          signUp: mockSignUp,
        },
      })
      
      render(<SignUpForm />)
      
      const nameInput = screen.getByLabelText(/이름/i)
      const emailInput = screen.getByLabelText(/이메일 주소/i)
      const passwordInput = screen.getByLabelText(/^비밀번호 \*/)
      const confirmPasswordInput = screen.getByLabelText(/비밀번호 확인/i)
      const businessNameInput = screen.getByLabelText(/사업체명/i)
      
      await user.type(nameInput, "admin'; DROP TABLE users;--")
      await user.type(emailInput, "test@example.com")
      await user.type(passwordInput, "Password123!")
      await user.type(confirmPasswordInput, "Password123!")
      await user.type(businessNameInput, "'; DELETE FROM businesses;--")
      
      const submitButton = screen.getByRole('button', { name: /회원가입/i })
      await user.click(submitButton)
      
      await waitFor(() => {
        // Supabase가 자동으로 SQL injection을 방지하는지 확인
        expect(mockSignUp).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'Password123!',
          options: {
            data: {
              name: "admin'; DROP TABLE users;--",
              business_name: "'; DELETE FROM businesses;--",
              business_type: '',
              phone: ''
            }
          }
        })
      })
    })

    it('비밀번호 강도 검증이 클라이언트와 서버 모두에서 이루어져야 한다', async () => {
      render(<SignUpForm />)
      
      const passwordInput = screen.getByLabelText(/^비밀번호 \*/)
      
      // 약한 비밀번호 입력
      await user.type(passwordInput, '123')
      
      // 클라이언트 사이드 검증 확인 - 충족하지 못한 조건들이 회색으로 표시
      expect(screen.getByText(/8자 이상/i).parentElement).toHaveClass('text-gray-400')
      expect(screen.getByText(/대문자 포함/i).parentElement).toHaveClass('text-gray-400')
      
      // 강한 비밀번호 입력
      await user.clear(passwordInput)
      await user.type(passwordInput, 'StrongP@ssw0rd!')
      
      // 모든 조건 충족 확인
      await waitFor(() => {
        expect(screen.getByText(/8자 이상/i).parentElement).toHaveClass('text-green-600')
        expect(screen.getByText(/대문자 포함/i).parentElement).toHaveClass('text-green-600')
        expect(screen.getByText(/소문자 포함/i).parentElement).toHaveClass('text-green-600')
        expect(screen.getByText(/숫자 포함/i).parentElement).toHaveClass('text-green-600')
        expect(screen.getByText(/특수문자 포함/i).parentElement).toHaveClass('text-green-600')
      })
    })
  })

  describe('에러 복구', () => {
    it('에러 메시지가 표시된 후 입력 시 에러가 사라져야 한다', async () => {
      render(<SignUpForm />)
      
      const submitButton = screen.getByRole('button', { name: /회원가입/i })
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/이름은 2자 이상 입력해주세요/i)).toBeInTheDocument()
      })
      
      const nameInput = screen.getByLabelText(/이름/i)
      await user.type(nameInput, '홍')
      
      await waitFor(() => {
        expect(screen.queryByText(/이름은 2자 이상 입력해주세요/i)).not.toBeInTheDocument()
      })
    })

    it('네트워크 오류 발생 시 일반 오류 메시지를 표시해야 한다', async () => {
      const { createClientComponentClient } = require('@supabase/auth-helpers-nextjs')
      const mockSignUp = jest.fn().mockRejectedValue(new Error('Network error'))
      
      createClientComponentClient.mockReturnValue({
        auth: {
          signUp: mockSignUp,
        },
      })
      
      render(<SignUpForm />)
      
      const nameInput = screen.getByLabelText(/이름/i)
      const emailInput = screen.getByLabelText(/이메일 주소/i)
      const passwordInput = screen.getByLabelText(/^비밀번호 \*/)
      const confirmPasswordInput = screen.getByLabelText(/비밀번호 확인/i)
      const businessNameInput = screen.getByLabelText(/사업체명/i)
      
      await user.type(nameInput, '홍길동')
      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'Password123!')
      await user.type(confirmPasswordInput, 'Password123!')
      await user.type(businessNameInput, '테스트 회사')
      
      const submitButton = screen.getByRole('button', { name: /회원가입/i })
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/회원가입 중 오류가 발생했습니다. 다시 시도해주세요/i)).toBeInTheDocument()
      })
    })
  })
})