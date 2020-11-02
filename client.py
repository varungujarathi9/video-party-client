# 0 - create room
# 1 - join room
# 2 - play
# 3 - pause
# 4 - play at

# TODO: Import the message queue list from utility.py in here and keep reading it

import tkinter
import cv2
import PIL.Image, PIL.ImageTk
import time
import _thread
import json

from tkinter import filedialog,messagebox
import client_utility as cu

class App:
	def __init__(self, window, window_title):
		self.window = window
		self.window.config(background = "white")
		self.window.geometry("500x500")
		self.window.title(window_title)
		self.initialize()
		self.displayDetails = True

	# GUI Functions ---------------------------------------

	def initialize(self):
		try:
			# text field to enter username
			self.username_label = tkinter.Label(self.window,text='What should we call you',font=('calibre', 10, 'bold'), bg='white')
			self.text_example = tkinter.Entry(self.window)
			self.btn_submit=tkinter.Button(self.window, text="Connect", width=30,command =self.login, bg='green')

			self.username_label.place(relx=0.5, rely=0.3, anchor=tkinter.CENTER)
			self.text_example.place(relx=0.5, rely=0.35, anchor=tkinter.CENTER)
			self.btn_submit.place(relx=0.5, rely=0.5, anchor=tkinter.CENTER)

			self.widget_list = self.check_widgets()
			self.window.mainloop()
		except KeyboardInterrupt:
			pass

	def create_or_join(self):
		try:
			self.clear_window()
			btn_create = tkinter.Button(self.window, text = "Create Room", command = self.create_room, width=10)
			btn_join = tkinter.Button(self.window, text = "Join Room", command =self.enter_room_details, width=10)
			btn_exit = tkinter.Button(self.window, text = "Exit", command = exit, width=10)
			btn_create.place(relx=0.5, rely=0.3, anchor=tkinter.CENTER)
			btn_join.place(relx=0.5, rely=0.4, anchor=tkinter.CENTER)
			btn_exit.place(relx=0.5, rely=0.5, anchor=tkinter.CENTER)
			self.widget_list = self.check_widgets()
		except KeyboardInterrupt:
			pass

	def enter_room_details(self):
		try:
			self.clear_window()
			self.enter_room_id = tkinter.Entry(self.window)
			self.enter_room_id.pack()
			btn_join_room = tkinter.Button(self.window, text = "Enter Room Code", command =self.join_room,width=10)
			btn_back = tkinter.Button(self.window, text = "Back", command =self.create_or_join,width=10)
			btn_join_room.pack(anchor=tkinter.CENTER, expand=True)
			btn_back.pack(anchor=tkinter.CENTER, expand=True)
			self.widget_list = self.check_widgets()
		except KeyboardInterrupt:
			pass

	def join_room(self):
		validRoomId = self.enter_room_id.get()
		if validRoomId and self.username:
			join_roomCheck=cu.join_room(self.username,validRoomId)
			if join_roomCheck :
				while(len(cu.message_queue)==0):
					pass
				message = json.loads(cu.message_queue.pop(0))
				if 'join' in message:
					self.clear_window()
					self.browse()
				elif 'error' in message:
          tkinter.messagebox.showerror("error",message['error'])
					print("DISPLAY : ", message['error'])

			else:
				print(join_roomCheck)

	def browse(self):
		try:

			def browseFiles():
				filename = filedialog.askopenfilename(initialdir = "~/", title = "Select a File", filetypes = (("Text files", "*.txt*"), ("all files","*.*")))
				label_file_explorer.configure(text="File Opened: "+filename)

			self.window.title('Select a video file to play')

			self.window.geometry("500x500")

			self.window.config(background = "white")

			label_file_explorer = tkinter.Label(self.window,
										text = "File Explorer using Tkinter",
										width = 100, height = 4,
										fg = "blue")


			button_explore = tkinter.Button(self.window,
									text = "Browse Files",
									command = browseFiles,width=10)

			roomIdLabel=tkinter.Label(self.window,text=self.roomId,
									width=50)

			# get username from receive message

			code = tkinter.Text(self.window, height=2)
			button_goBack = tkinter.Button(self.window,
									text = "Back",
									command =self.create_or_join,width=10)


			label_file_explorer.grid(column = 1, row = 1)
			code.grid(column=1,row = 3)
			button_explore.grid(column = 1, row = 4)
			roomIdLabel.grid(column=1,row=6)
			button_goBack.grid(column=1,row=7)
			self.widget_list = self.check_widgets()

			# Let the window wait for any events
			self.window.mainloop()
		except KeyboardInterrupt:
			pass

	def home(self):

		VideoPlayer("Home Page")


	def check_widgets(self):
		_list = self.window.winfo_children()
		# for item in _list :
			# if item.winfo_children() :
			#     _list.extend(item.winfo_children())
			# print("check the childre items")

			# print(item.winfo_class())
			# print("type of widget")
			# print(item.winfo_manager())


		return _list

	def clear_window(self):
		for item in self.widget_list:
			if(item.winfo_manager()=='pack'):
				item.pack_forget()
			if(item.winfo_manager()=='grid'):
				item.grid_forget()
			if(item.winfo_manager()=='place'):
				item.place_forget()

	# Non-GUI functions ------------------------------------------
	def login(self):
		self.username = self.text_example.get()

		if self.username == "":
			print('DISPLAY : Username cannot be empty')
		elif len(self.username) <= 1:
			print('DISPLAY : Username cannot be single charecter')
		else:
			print("DISPLAY : Connecting to server")
			self.server_connected, self.error_message = cu.connect_server()
			if self.server_connected:
				self.clear_window()
				self.create_or_join()
			elif not self.server_connected:
				tkinter.messagebox.showerror("error",self.error_message)

	def create_room(self):
		self.create_roomCheck = cu.create_room(self.username)
		if(self.create_roomCheck):
			while len(cu.message_queue)==0:
				pass

			message = json.loads(cu.message_queue.pop(0))

			if "created" in message.keys():
				self.roomId = message['created']
				print("roomId",self.roomId)
				self.clear_window()
				self.browse()
			elif "error" in message.keys():
				tkinter.messagebox("error",message['error'])
				print(self.error_message)

class VideoPlayer:

	def __init__(self, window, window_title, video_source=0):

		self.window = window
		self.window.title(window_title)
		self.video_source = video_source
		self.playerWindow()

	def playerWindow(self):
		try:
			self.text_example = tkinter.Text(self.window, height=10)
			self.text_example.pack()

			# open video source (by default this will try to open the computer webcam)
			self.vid = MyVideoCapture(self.video_source)

			# Create a canvas that can fit the above video source size
			self.canvas = tkinter.Canvas(self.window, width = self.vid.width, height = self.vid.height)
			self.canvas.pack()

			# Button that lets the user take a snapshot
			self.btn_pause=tkinter.Button(self.window, text="Pause", width=50, command=self.pause)
			self.btn_play = tkinter.Button(self.window, text="Play", width=50, command=self.play)
			self.btn_pause.pack(anchor=tkinter.CENTER, expand=True)
			self.btn_play.pack(anchor=tkinter.CENTER, expand=True)

			# After it is called once, the update method will be automatically called every delay milliseconds
			self.delay = 15
			self.update()
			self.widget_List = self.check_widgets()
			self.window.mainloop()
		except KeyboardInterrupt:
			pass

	def pause(self):
		print("pause button pressed")
		# Get a frame from the video source
#          ret, frame = self.vid.get_frame()
#
#          if ret:
#
#              cv2.imwrite("frame-" + time.strftime("%d-%m-%Y-%H-%M-%S") + ".jpg", cv2.cvtColor(frame, cv2.COLOR_RGB2BGR))

	def play(self):

		print("play button pressed")

	def update(self):

		# Get a frame from the video source
		ret, frame = self.vid.get_frame()

		if ret:

			self.photo = PIL.ImageTk.PhotoImage(image = PIL.Image.fromarray(frame))
			self.canvas.create_image(0, 0, image = self.photo, anchor = tkinter.NW)

		self.window.after(self.delay, self.update)

class MyVideoCapture:

	def __init__(self, video_source="Alexa intro.mp4"):
		# Open the video source
		self.vid = cv2.VideoCapture(video_source)
		if not self.vid.isOpened():
			raise ValueError("Unable to open video source", video_source)

		# Get video source width and height
		self.width = self.vid.get(cv2.CAP_PROP_FRAME_WIDTH)
		self.height = self.vid.get(cv2.CAP_PROP_FRAME_HEIGHT)

	def get_frame(self):

		if self.vid.isOpened():

			ret, frame = self.vid.read()
			if ret:

				# Return a boolean success flag and the current frame converted to BGR
				return (ret, cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
			else:

				return (ret, None)
		else:
			return (False, None)

	# Release the video source when the object is destroyed

		if self.vid.isOpened():

			self.vid.release()


# Create a window and pass it to the Application object
App(tkinter.Tk(), "Video Party")

# def read_message():

#   while True:
#     try:
#       # print("message que")
#       # print(cu.message_queue)
#       if(len(cu.message_queue)>0):
#         message = json.loads(cu.message_queue.pop(0))
#         if "created" in message.keys():
#           home.browse()
#           print("display message",json.dumps(message))
#     except KeyboardInterrupt as e:
#       break

# _thread.start_new_thread(read_message,())


