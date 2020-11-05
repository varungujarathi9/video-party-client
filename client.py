# 0 - create room
# 1 - join room
# 2 - play
# 3 - pause
# 4 - play at

import tkinter
import cv2
import PIL.Image, PIL.ImageTk
import time
import _thread
import json
from tkinter import filedialog,messagebox
from videoprops import get_video_properties
import tqdm
import os

import client_utility as cu


SEPARATOR = "<SEPARATOR>"
BUFFER_SIZE = 4096
class App:
	def __init__(self, window, window_title):
		self.window = window
		self.window.config(background = "white")
		self.window.title(window_title)
		self.window_padding = 3
		self.window_geom='600x600+0+0'
		self.window.geometry("{0}x{1}+0+0".format(self.window.winfo_screenwidth() - self.window_padding, self.window.winfo_screenheight() - self.window_padding))
		self.window.bind('<Escape>',self.toggle_geom)
		self.initialize()

	def toggle_geom(self,event):
		self.window_geom=self.window.winfo_geometry()
		self.window.geometry(self._geom)
		self._geom='100x100+0+0'

	# GUI Functions ---------------------------------------

	def initialize(self):
		try:
			# text field to enter username
			self.username_label = tkinter.Label(self.window,text='What should we call you',font=('calibre', 10, 'bold'), bg ='white')
			self.text_example = tkinter.Entry(self.window)
			self.btn_submit=tkinter.Button(self.window, text="Connect", width=30,command =self.login, bg ='green')

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
			self.window.mainloop()
		except KeyboardInterrupt:
			pass

	def enter_room_details(self):
		try:
			self.clear_window()
			self.enter_room_id = tkinter.Entry(self.window)
			self.enter_room_id.pack()
			btn_join_room = tkinter.Button(self.window, text = "Enter Room Code", command =self.join_room,width=10)
			btn_download_file = tkinter.Button(self.window, text = "Download file", command = self.download_file, width=10)
			btn_back = tkinter.Button(self.window, text = "Back", command =self.create_or_join,width=10)
			btn_join_room.pack(anchor=tkinter.CENTER, expand=True)
			btn_download_file.pack(anchor=tkinter.CENTER,expand=True)
			btn_back.pack(anchor=tkinter.CENTER, expand=True)
			self.widget_list = self.check_widgets()
			self.window.mainloop()
		except KeyboardInterrupt:
			pass

	def browse(self):
		try:
			self.clear_window()
			def browse_file():
				self.filename = filedialog.askopenfilename(initialdir = "~/", title = "Select a file", filetypes = (("Video file", "*.mp4* *.mkv* *.mpv* *.avi* *.webm*"), ("All files","*.*")))
				if self.filename not in (""," ",None) and type(self.filename) is not tuple:
					label_file_explorer.configure(text="File selected: " + self.filename)
					btn_next.place(relx=0.5, rely=0.5, anchor=tkinter.CENTER)
					btn_share_file.place(relx=0.5,rely=0.6,anchor=tkinter.CENTER)
					self.window.mainloop()

			label_file_explorer = tkinter.Label(self.window, text = "Select a file to play", width = 100, height = 4, fg = "blue")
			btn_explore = tkinter.Button(self.window, text = "Browse", command = browse_file, width=10)
			btn_next = tkinter.Button(self.window, text = "Next", command = self.display_room_info, width=10)
			btn_back = tkinter.Button(self.window, text = "Back", command = self.create_or_join, width=10)
			btn_share_file = tkinter.Button(self.window, text = "Share file", command = self.share_file, width=10)
			room_id_label=tkinter.Label(self.window, text="Share this room code with your friends: " + self.room_id)


			label_file_explorer.place(relx=0.5, rely=0.05, anchor=tkinter.CENTER)
			btn_explore.place(relx=0.5, rely=0.3, anchor=tkinter.CENTER)
			room_id_label.place(relx=0.5, rely=0.4, anchor=tkinter.CENTER)
			
			btn_back.place(relx=0.5, rely=0.7, anchor=tkinter.CENTER)

			self.widget_list = self.check_widgets()
			self.window.mainloop()
		except KeyboardInterrupt:
			pass

	def display_room_info(self):
		self.clear_window()

		if self.filename not in (""," ",None) and type(self.filename) is not tuple:
			# room_id_label=tkinter.Label(self.window, text="Share this room code with your friends: " + self.room_id)
			# room_id_label.place(relx=0.5, rely=0.3, anchor=tkinter.CENTER)

			member_label=tkinter.Label(self.window, text="List of members in room")
			member_label.place(relx=0.5, rely=0.4, anchor=tkinter.CENTER)

			btn_start = tkinter.Button(self.window, text = "Start", command = self.player_window, width=10)
			btn_start.place(relx=0.5, rely=0.6, anchor=tkinter.CENTER)

		else:
			self.browse()

		self.widget_list = self.check_widgets()
		self.window.mainloop()

	def player_window(self):
		try:
			# self.clear_window()
			# open video source (by default this will try to open the computer webcam)
			self.canvas_width = self.window.winfo_screenwidth()
			self.canvas_height = self.window.winfo_screenheight()-100
			# self.video = VideoStreamer(self.filename, self.canvas_width, self.canvas_height)

			self.video = VideoStreamer(self.filename, self.canvas_width, self.canvas_height)

			# Create a canvas that can fit the above video source size
			self.canvas = tkinter.Canvas(self.window, width = self.canvas_width, height = self.canvas_height, bg='black')
			self.canvas.pack()

			# Button that lets the user take a snapshot
			self.btn_pause=tkinter.Button(self.window, text="Pause", width=50, command=self.pause)
			self.btn_play = tkinter.Button(self.window, text="Play", width=50, command=self.play)
			self.btn_pause.pack(anchor=tkinter.CENTER, expand=True)
			self.btn_play.pack(anchor=tkinter.CENTER, expand=True)

			# After it is called once, the update method will be automatically called every delay milliseconds
			self.delay = 15
			self.update()
			self.widget_list = self.check_widgets()
			self.window.mainloop()

		except KeyboardInterrupt:
			pass

	def pause(self):
		print("pause button pressed")
		# Get a frame from the video source

	def play(self):

		print("play button pressed")

	def update(self):

		# Get a frame from the video source
		ret, frame = self.video.get_frame()

		if ret:
			self.photo = PIL.ImageTk.PhotoImage(image = PIL.Image.fromarray(frame))
			self.canvas.create_image(0, 0, image = self.photo, anchor = tkinter.NW)

		self.window.after(self.delay, self.update)

	def check_widgets(self):
		_list = self.window.winfo_children()
		# for item in _list :
			# if item.winfo_children() :
			#     _list.extend(item.winfo_children())
			# print("check the children items")

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
				self.create_or_join()
			elif not self.server_connected:
				tkinter.messagebox.showerror("Error",self.error_message)

	def create_room(self):
		self.create_roomCheck = cu.create_room(self.username)
		if(self.create_roomCheck):
			while len(cu.message_queue)==0:
				pass

			message = json.loads(cu.message_queue.pop(0))

			if "created" in message.keys():
				self.room_id = message['created']
				self.browse()
			elif "error" in message.keys():
				tkinter.messagebox("error",message['error'])
				print(self.error_message)

	def join_room(self):
		valid_room_id = self.enter_room_id.get()
		if valid_room_id and self.username:
			join_ret = cu.join_room(self.username,valid_room_id)
			if join_ret :
				while(len(cu.message_queue)==0):
					pass
				message = json.loads(cu.message_queue.pop(0))
				if 'join' in message:
					self.browse()
				elif 'error' in message:
					tkinter.messagebox.showerror("error",message['error'])
					print("DISPLAY : ", message['error'])

			else:
				print(join_ret)

	def share_file(self):
		self.fileSize = os.path.getsize(self.filename)
		progress = tqdm.tqdm(range(self.fileSize),f"Sending{self.filename}",unit="B",unit_scale = True,unit_divisor=1024)
		with open(self.filename,"rb") as f:
			bytes_read = f.read(BUFFER_SIZE)
			if not bytes_read:
				return
			if(cu.send_share_file(self.room_id,self.filename,self.fileSize,bytes_read)):
				progress.update(len(bytes_read))
			
	def download_file(self):
		# read file from server
		print("the file to be downloaded is .")
	

class VideoStreamer:

	def __init__(self, video_source, display_width, display_height):
		# Open the video source
		self.video = cv2.VideoCapture(video_source)
		if not self.video.isOpened():
			raise ValueError("Unable to open video source", video_source)

		# Get video source width and height
		self.display_width = display_width
		self.display_height = display_height
		self.aspect_ratio = float(display_width / display_height)

	def get_frame(self):

		if self.video.isOpened():

			ret, frame = self.video.read()
			if ret:
				frame_height, frame_width, _ = frame.shape
				if frame_height * self.aspect_ratio > frame_width:
					frame = cv2.resize(frame, (int(frame_width/frame_height*self.display_height), self.display_height))
				else:
					frame = cv2.resize(frame, (self.display_width, int(frame_height/frame_width*self.display_width)))

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


