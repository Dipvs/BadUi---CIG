import { useEffect, useRef, useState, type FormEvent } from 'react'
import './App.css'

const monthNames = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]
const weekdays = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB']

const units = [
  '', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove',
]
const teens = [
  'dez', 'onze', 'doze', 'treze', 'catorze', 'quinze', 'dezesseis',
  'dezessete', 'dezoito', 'dezenove',
]
const tens = ['', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa']

function numberInWords(number: number) {
  if (number < 10) return units[number]
  if (number < 20) return teens[number - 10]

  const ten = Math.floor(number / 10)
  const unit = number % 10
  return unit ? `${tens[ten]} e ${units[unit]}` : tens[ten]
}

function yearInWords(year: number) {
  if (year < 2000) {
    const remainder = year - 1900
    return remainder ? `mil novecentos e ${numberInWords(remainder)}` : 'mil e novecentos'
  }

  const remainder = year - 2000
  return remainder ? `dois mil e ${numberInWords(remainder)}` : 'dois mil'
}

const years = Array.from({ length: 200 }, (_, index) => 1900 + index)
  .map((year) => ({ year, label: yearInWords(year) }))
  .sort((a, b) => a.label.localeCompare(b.label))

function CalendarHell({
  value,
  onChange,
}: {
  value: string
  onChange: (date: string) => void
}) {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [offset, setOffset] = useState(0)
  const [dayOrder, setDayOrder] = useState(weekdays)
  const [fallen, setFallen] = useState(false)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDay = (new Date(year, month, 1).getDay() + offset) % 7
  const selectedDay = value ? Number(value.split('-')[2]) : 0

  const changeDatePart = (nextYear: number, nextMonth: number) => {
    setYear(nextYear)
    setMonth(nextMonth)
    onChange('')
  }

  const rotateWeekdays = (direction: 'previous' | 'next') => {
    setOffset((current) => (current + (direction === 'previous' ? 6 : 1)) % 7)
    setDayOrder((current) => direction === 'previous'
      ? [...current.slice(1), current[0]]
      : [current[current.length - 1], ...current.slice(0, -1)])
  }

  return (
    <div className="calendar-wrap">
      <div className={`calendar${fallen ? ' fallen' : ''}`}>
        <div className="calendar-controls">
          <label className="calendar-year" data-value={yearInWords(year)}>
            <span className="sr-only">Ano de nascimento</span>
            <select
              value={year}
              onChange={(event) => changeDatePart(Number(event.target.value), month)}
            >
              {years.map(({ year: optionYear, label }) => (
                <option value={optionYear} key={optionYear}>{label}</option>
              ))}
            </select>
          </label>
          <div className="calendar-buttons">
            <button type="button" aria-label="Ir para janeiro de mil e novecentos" onClick={() => changeDatePart(1900, 0)}>«</button>
            <button type="button" aria-label="Mudar a ordem dos dias para trás" onClick={() => rotateWeekdays('previous')}>‹</button>
            <label className="calendar-month" data-value={monthNames[month]}>
              <span className="sr-only">Mês de nascimento</span>
              <input
                type="range"
                min="0"
                max="11"
                value={month}
                onChange={(event) => changeDatePart(year, Number(event.target.value))}
              />
            </label>
            <button type="button" aria-label="Mudar a ordem dos dias para frente" onClick={() => rotateWeekdays('next')}>›</button>
            <button type="button" aria-label="Ir para dezembro de dois mil e noventa e nove" onClick={() => changeDatePart(2099, 11)}>»</button>
          </div>
        </div>
        <div
          className="calendar-days"
          onClick={(event) => {
            if (event.target instanceof HTMLSpanElement) setFallen(true)
          }}
        >
          {dayOrder.map((weekday) => <span className="weekday" key={weekday}>{weekday}</span>)}
          {Array.from({ length: firstDay }, (_, index) => <span aria-hidden="true" key={`blank-${index}`} />)}
          {Array.from({ length: daysInMonth }, (_, index) => {
            const day = index + 1
            const dateValue = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            return (
              <button
                type="button"
                aria-label={`${day} de ${monthNames[month]} de ${year}`}
                aria-pressed={selectedDay === day}
                className={selectedDay === day ? 'selected-day' : ''}
                data-day={day}
                key={day}
                onClick={() => onChange(dateValue)}
              />
            )
          })}
        </div>
      </div>
      <div className="calendar-selection" aria-live="polite">
        {value
          ? `${selectedDay} de ${monthNames[month]} de ${year}`
          : 'Selecione um dia'}
      </div>
    </div>
  )
}

function App() {
  const [phone, setPhone] = useState(55555555555)
  const [advancedMode, setAdvancedMode] = useState(false)
  const [angle, setAngle] = useState(0)
  const [message, setMessage] = useState('')
  const [birthday, setBirthday] = useState('')
  const [emailSuffix, setEmailSuffix] = useState('other')
  const phoneRef = useRef(phone)
  const speedRef = useRef(0)

  useEffect(() => {
    if (!advancedMode || angle === 0) return

    const timer = window.setInterval(() => {
      speedRef.current += Math.sin((angle * Math.PI) / 180) * 2
      speedRef.current *= 0.94
      const next = Math.min(
        99999999999,
        Math.max(10000000000, phoneRef.current + Math.round(speedRef.current * 5)),
      )
      phoneRef.current = next
      setPhone(next)

      if (next === 10000000000 || next === 99999999999) {
        speedRef.current *= -1
      }
    }, 60)

    return () => window.clearInterval(timer)
  }, [advancedMode, angle])

  const changePhone = (value: number) => {
    phoneRef.current = value
    speedRef.current = 0
    setPhone(value)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!birthday) {
      setMessage('Escolha sua data de nascimento no calendário.')
      return
    }
    setMessage('Cadastro concluído. Obrigado pela paciência!')
  }

  const digits = String(phone).padStart(11, '0')
  const formattedPhone = `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 9)}`;

  return (
    <main className="page">
      <h1>Cadastro simples</h1>
      <p>Preencha tudo para continuar. Não deve demorar.</p>

      <form className="form" onSubmit={handleSubmit}>
        <label htmlFor="name">Nome completo</label>
        <input id="name" name="name" autoComplete="name" required />

        <label>E-mail</label>
        <div className="email-fields">
          <label className="sr-only" htmlFor="email-user">Seu e-mail</label>
          <input
            id="email-user"
            name="emailUser"
            type="text"
            placeholder="Your email"
            autoComplete="username"
            required
          />
          <span aria-hidden="true">@</span>
          <label className="sr-only" htmlFor="email-domain">Domínio</label>
          <input
            id="email-domain"
            name="emailDomain"
            type="text"
            placeholder="Domain"
            required
          />
          <label className="sr-only" htmlFor="email-suffix">Final do e-mail</label>
          <select
            id="email-suffix"
            name="emailSuffix"
            value={emailSuffix}
            onChange={(event) => setEmailSuffix(event.target.value)}
          >
            <option value="other">other</option>
            <option value=".org">.org</option>
            <option value=".co.uk">.co.uk</option>
            <option value=".net">.net</option>
            <option value=".gov">.gov</option>
            <option value=".de">.de</option>
            <option value=".fr">.fr</option>
            <option value=".nl">.nl</option>
            <option value=".com">.com</option>
            <option value=".be">.be</option>
            <option value=".jpg">.jpg</option>
          </select>
        </div>

        <label htmlFor="password">Senha</label>
        <input id="password" name="password" type="password" minLength={8} required />

        <fieldset>
          <legend>Data de nascimento</legend>
          <CalendarHell value={birthday} onChange={setBirthday} />
        </fieldset>

        <fieldset>
          <legend>Telefone</legend>
          <div className="phone" style={{ transform: `rotate(${angle}deg)` }}>
            <span>+351</span> {formattedPhone}
          </div>
          <label className="sr-only" htmlFor="phone">Arraste para escolher o telefone</label>
          <input
            id="phone"
            className="slider"
            type="range"
            min="10000000000"
            max="99999999999"
            value={phone}
            onChange={(event) => changePhone(Number(event.target.value))}
          />
          <div className="range-labels"><span>menos</span><span>mais</span></div>

          <label className="advanced">
            <input
              type="checkbox"
              checked={advancedMode}
              onChange={(event) => {
                setAdvancedMode(event.target.checked)
                if (!event.target.checked) setAngle(0)
              }}
            />
            Modo avançado
          </label>
          {advancedMode && (
            <label className="angle">
              Inclinação ({angle}°)
              <input
                type="range"
                min="-10"
                max="10"
                value={angle}
                onChange={(event) => setAngle(Number(event.target.value))}
              />
            </label>
          )}
        </fieldset>

        <label className="terms">
          <input type="checkbox" required />
          Aceito os termos e condições.
        </label>
        <button type="submit">Continuar</button>
        {message && <p className="message" role="status">{message}</p>}
      </form>

      <footer>
        Inspirado por <a href="https://userinyerface.com/" target="_blank" rel="noreferrer">User Inyerface</a>
        {' '}e <a href="https://goulartnogueira.github.io/BadUI/" target="_blank" rel="noreferrer">Bad UI</a>.
      </footer>
    </main>
  )
}

export default App
